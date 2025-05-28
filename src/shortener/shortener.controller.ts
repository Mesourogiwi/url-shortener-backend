import {Controller, Get, Post, Body} from '@nestjs/common'
import {ShortenerService} from './shortener.service'
import {CreateShortenerDto} from './dto/create-shortener.dto'

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
}
