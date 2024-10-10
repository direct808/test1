import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import 'cache-manager'
import { redisStore } from 'cache-manager-redis-store'
import type { RedisClientOptions } from 'redis'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PurchasesService } from './purchases.service'
import { ItemService } from './item.service'
import { Item, Transaction, User } from './entities'

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      // @ts-ignore
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'db',
      entities: [Transaction, User, Item],
      synchronize: true,
      logging: 'all',
    }),
  ],
  controllers: [AppController],
  providers: [ItemService, PurchasesService],
})
export class AppModule {}
