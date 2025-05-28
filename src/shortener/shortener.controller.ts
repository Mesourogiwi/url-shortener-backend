import {Controller, Get, Post, Body, Param, Res} from '@nestjs/common'
import {ShortenerService} from './shortener.service'
import {CreateShortenerDto} from './dto/create-shortener.dto'
import {Response} from 'express'

@Controller('shortener')
export class ShortenerController {
    constructor(private readonly shortenerService: ShortenerService) {}

    @Post()
    create(@Body() createShortenerDto: CreateShortenerDto) {
        return this.shortenerService.create(createShortenerDto)
    }

    @Get()
    findAll() {
        return this.shortenerService.findAll()
    }

    @Get(':shortUrl')
    async findOne(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
        const link = await this.shortenerService.findOne(shortUrl)

        return res.redirect(301, link.url)
    }
}
