import {Controller, Get, Post, Body, Patch, Param, Delete, Res} from '@nestjs/common'
import {ShortenerService} from './shortener.service'
import {CreateShortenerDto} from './dto/create-shortener.dto'
import {UpdateShortenerDto} from './dto/update-shortener.dto'
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

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateShortenerDto: UpdateShortenerDto) {
        return this.shortenerService.update(+id, updateShortenerDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.shortenerService.remove(+id)
    }
}
