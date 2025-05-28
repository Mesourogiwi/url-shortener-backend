import {Test, TestingModule} from '@nestjs/testing'
import {CACHE_MANAGER} from '@nestjs/cache-manager'
import {ShortenerService} from './shortener.service'
import {CreateShortenerDto} from './dto/create-shortener.dto'
import {addMinutes} from 'date-fns'

const mockDb = {
    insert: jest.fn(() => ({
        values: jest.fn().mockReturnThis()
    }))
}

const mockCacheManager = {
    del: jest.fn().mockResolvedValue(true)
}

jest.mock('date-fns', () => ({
    addMinutes: jest.fn((date, minutes) => {
        const mockDate = new Date('2025-01-01T10:00:00.000Z')
        mockDate.setMinutes(mockDate.getMinutes() + minutes)
        return mockDate
    })
}))

process.env.EXPIRATION_TIME_MINUTES = '30'

describe('test shortenerService', () => {
    let service: ShortenerService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ShortenerService,
                {
                    provide: 'DRIZZLE',
                    useValue: mockDb
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: mockCacheManager
                }
            ]
        }).compile()

        service = module.get<ShortenerService>(ShortenerService)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('create', () => {
        it('should generate a short URL, insert into DB, clear cache, and return the URLs', async () => {
            const createDto: CreateShortenerDto = {url: 'https://example.com/long/url'}

            const result = await service.create(createDto)

            expect(addMinutes).toHaveBeenCalledTimes(1)
            expect(mockDb.insert).toHaveBeenCalledTimes(1)
            expect(mockDb.insert).toHaveBeenCalledWith(expect.anything())

            const insertValues = mockDb.insert.mock.results[0].value.values.mock.calls[0][0]
            expect(insertValues.url).toBe(createDto.url)
            expect(insertValues.shortUrl).toEqual(expect.any(String))
            expect(insertValues.shortUrl.length).toBeGreaterThan(0)
            expect(insertValues.expirationTime).toEqual(expect.any(Date))

            expect(mockCacheManager.del).toHaveBeenCalledTimes(1)
            expect(mockCacheManager.del).toHaveBeenCalledWith('all_shortened_urls')

            expect(result).toEqual({
                url: createDto.url,
                shortUrl: expect.any(String)
            })
            expect(result.shortUrl).toBe(insertValues.shortUrl)
        })

        it('should handle different EXPIRATION_TIME_MINUTES from environment', async () => {
            process.env.EXPIRATION_TIME_MINUTES = '60'
            const createDto: CreateShortenerDto = {url: 'https://another.com'}

            await service.create(createDto)

            expect(addMinutes).toHaveBeenCalledWith(expect.any(Date), 60)
            process.env.EXPIRATION_TIME_MINUTES = '30'
        })

        it('should ensure the generated shortUrl is a string', async () => {
            const createDto: CreateShortenerDto = {url: 'https://test.com'}
            const result = await service.create(createDto)
            expect(typeof result.shortUrl).toBe('string')
            expect(result.shortUrl.length).toBeGreaterThan(0)
        })
    })
})
