import {Module} from '@nestjs/common'
import {ShortenerService} from './shortener.service'
import {ShortenerController} from './shortener.controller'
import {DatabaseModule} from '../db/drizzle.provider'

@Module({
    imports: [DatabaseModule],
    controllers: [ShortenerController],
    providers: [ShortenerService]
})
export class ShortenerModule {}
