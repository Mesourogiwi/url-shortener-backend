import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {ConfigModule} from '@nestjs/config'
import {ShortenerModule} from './shortener/shortener.module'
import {CacheModule} from '@nestjs/cache-manager'
import {redisStore} from 'cache-manager-ioredis-yet'
import {ShortenerService} from './shortener/shortener.service'
import {DatabaseModule} from './db/drizzle.provider'

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        ShortenerModule,
        DatabaseModule,
        CacheModule.register({
            useFactory: async () => ({
                store: await redisStore({host: 'redis', port: 6379, ttl: 60})
            }),
            isGlobal: true
        })
    ],
    controllers: [AppController],
    providers: [AppService, ShortenerService]
})
export class AppModule {}
