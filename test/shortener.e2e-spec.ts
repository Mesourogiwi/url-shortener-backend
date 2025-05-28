import {Test, TestingModule} from '@nestjs/testing'
import {INestApplication} from '@nestjs/common'
import * as request from 'supertest'
import {AppModule} from '../src/app.module'
import {CACHE_MANAGER} from '@nestjs/cache-manager'

const mockDb = {
    insert: jest.fn(() => ({
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([
            {
                id: 'mockedId123',
                url: 'https://my-awesome-site.com/very/long/path',
                shortUrl: 'mockedShortUrl',
                expirationTime: new Date('2025-01-01T10:30:00.000Z')
            }
        ])
    }))
}

const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
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

describe('ShortenerController (e2e)', () => {
    let app: INestApplication

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        })
            .overrideProvider('DRIZZLE')
            .useValue(mockDb)
            .overrideProvider(CACHE_MANAGER)
            .useValue(mockCacheManager)
            .compile()

        app = moduleFixture.createNestApplication()
        await app.init()
    })

    afterEach(async () => {
        await app.close()
        jest.clearAllMocks()
    })

    it('should test /shortener and create new link', async () => {
        const originalUrl = 'https://my-awesome-site.com/very/long/path'
        const postData = {url: originalUrl}

        const expectedDbInsertResult = [
            {
                id: 'mockedId123',
                url: originalUrl,
                shortUrl: 'mockedShortUrl',
                expirationTime: new Date('2025-01-01T10:30:00.000Z')
            }
        ]
        mockDb.insert.mockReturnValueOnce({
            values: jest.fn().mockReturnThis(),
            returning: jest.fn().mockResolvedValueOnce(expectedDbInsertResult)
        })

        const response = await request(app.getHttpServer())
            .post('/shortener')
            .send(postData)
            .expect(201)

        expect(response.body).toEqual({
            url: originalUrl,
            shortUrl: expect.any(String)
        })

        expect(mockDb.insert).toHaveBeenCalledTimes(1)
        const insertValues = mockDb.insert.mock.results[0].value.values.mock.calls[0][0]
        expect(insertValues.url).toBe(originalUrl)
        expect(insertValues.shortUrl).toEqual(expect.any(String))
        expect(insertValues.shortUrl.length).toBeGreaterThan(0)
        expect(insertValues.expirationTime).toEqual(expect.any(Date))

        expect(mockCacheManager.del).toHaveBeenCalledTimes(1)
        expect(mockCacheManager.del).toHaveBeenCalledWith('all_shortened_urls')

        expect(response.body.shortUrl).toBe(insertValues.shortUrl)
    })
})
