import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {ConfigModule} from '@nestjs/config'
import { ShortenerModule } from './shortener/shortener.module';

@Module({
    imports: [ConfigModule.forRoot({isGlobal: true}), ShortenerModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
