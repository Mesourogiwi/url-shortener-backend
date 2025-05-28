import {Controller, Get, Param, Res} from '@nestjs/common'
import {AppService} from './app.service'
import {ShortenerService} from './shortener/shortener.service'
import {Response} from 'express'

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly shortenerService: ShortenerService
    ) {}

    @Get()
    getHello(): string {
        return this.appService.getHello()
    }

    @Get(':shortUrl')
    async findOne(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
        const link = await this.shortenerService.findOne(shortUrl)

        return res.redirect(301, link.url)
    }
}
