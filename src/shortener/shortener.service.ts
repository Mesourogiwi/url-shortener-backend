import {BadRequestException, Inject, Injectable, NotFoundException} from '@nestjs/common'
import {CreateShortenerDto} from './dto/create-shortener.dto'
import {MySql2Database} from 'drizzle-orm/mysql2'
import * as schema from '../db/schema'
import {addMinutes, differenceInMinutes} from 'date-fns'
import {eq} from 'drizzle-orm'
import {CACHE_MANAGER, CacheKey, CacheTTL} from '@nestjs/cache-manager'
import {Cache} from 'cache-manager'

@Injectable()
export class ShortenerService {
    constructor(
        @Inject('DRIZZLE') private readonly db: MySql2Database<typeof schema>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {}
    async create(createShortenerDto: CreateShortenerDto) {
        const generatedName = Math.random().toString(36).substring(7)
        await this.db.insert(schema.urlsTable).values({
            url: createShortenerDto.url,
            shortUrl: generatedName,
            expirationTime: addMinutes(new Date(), Number(process.env.EXPIRATION_TIME_MINUTES))
        })
        await this.cacheManager.del('all_shortened_urls')
        return {
            url: createShortenerDto.url,
            shortUrl: generatedName
        }
    }

    @CacheKey('all_shortened_urls')
    @CacheTTL(300)
    async findAll() {
        const result = await this.db.query.urlsTable.findMany()
        return result
    }

    @CacheTTL(60)
    async findOne(shortUrl: string) {
        const result = await this.db.query.urlsTable.findFirst({
            where: (url, {eq}) => eq(url.shortUrl, shortUrl)
        })

        if (!result) {
            throw new NotFoundException('Link inválido')
        }

        await this.db
            .update(schema.urlsTable)
            .set({
                numberOfAccesses: result.numberOfAccesses + 1
            })
            .where(eq(schema.urlsTable.shortUrl, shortUrl))

        console.log(differenceInMinutes(result.expirationTime, new Date()))

        if (differenceInMinutes(new Date(), result.expirationTime) > 0) {
            throw new BadRequestException('Link expirado')
        }

        return result
    }
}
