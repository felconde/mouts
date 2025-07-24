import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheService } from './cache.service';
import { ICacheService } from './cache.interface';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          url: configService.get('REDIS_URL'),
          ttl: 300 * 1000,
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: 'ICacheService',
      useClass: CacheService,
    },
  ],
  exports: ['ICacheService'],
})
export class CacheModule {} 