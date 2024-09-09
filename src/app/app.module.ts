import { Module } from '@nestjs/common';
import { EssencesModule } from '../modules/essences/essences.module';
import { ClientsModule } from '../infra/clients/clients.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppConstants } from './app.constants';
import { AuthModule } from '../modules/auth/auth.module';
import * as redisStore from 'cache-manager-redis-store';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get(AppConstants.LOG_LEVEL),
          serializers: {
            req: (req) => ({ requestId: req.id, method: req.method, url: req.url }),
            res: (res) => ({ statusCode: res.statusCode }),
          },
          genReqId: () => randomUUID(),
          transport: { target: 'pino-pretty', options: { singleLine: true } },
        },
      }),
    }),
    ConfigModule.forRoot(),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        ttl: Number(configService.get(AppConstants.CACHE_TTL)),
        host: configService.get(AppConstants.REDIS_HOST),
        port: Number(configService.get(AppConstants.REDIS_PORT)),
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        storage: new ThrottlerStorageRedisService(configService.get(AppConstants.THROTTLER_STORE_URL)),
        errorMessage: AppConstants.THROTTLER_ERROR_MESSAGE,
        throttlers: [
          {
            ttl: Number(configService.get(AppConstants.THROTTLER_TTL)),
            limit: Number(configService.get(AppConstants.THROTTLER_LIMIT)),
          },
        ],
      }),
    }),
    ClientsModule,
    EssencesModule,
    AuthModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
