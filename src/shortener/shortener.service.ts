import {Inject, Injectable, NotFoundException} from '@nestjs/common'
import {CreateShortenerDto} from './dto/create-shortener.dto'
import {UpdateShortenerDto} from './dto/update-shortener.dto'
import {MySql2Database} from 'drizzle-orm/mysql2'
import * as schema from '../db/schema'
import {addMinutes} from 'date-fns'
import {eq} from 'drizzle-orm'

@Injectable()
export class ShortenerService {
    constructor(@Inject('DRIZZLE') private readonly db: MySql2Database<typeof schema>) {}
    async create(createShortenerDto: CreateShortenerDto) {
        const generatedName = Math.random().toString(36).substring(7)
        await this.db.insert(schema.urlsTable).values({
            url: createShortenerDto.url,
            shortUrl: generatedName,
            expirationTime: addMinutes(new Date(), 5)
        })
        return 'Novo link gerado com sucesso!'
    }

    async findAll() {
        const result = await this.db.query.urlsTable.findMany()
        return result
    }

    async findOne(shortUrl: string) {
        const result = await this.db.query.urlsTable.findFirst({
            where: (url, {eq}) => eq(url.shortUrl, shortUrl)
        })

        if (!result) {
            throw new NotFoundException('Link inválido')
        }

        return result
    }

    update(id: number, updateShortenerDto: UpdateShortenerDto) {
        return `This action updates a #${id} shortener`
    }

    remove(id: number) {
        return `This action removes a #${id} shortener`
    }
}
