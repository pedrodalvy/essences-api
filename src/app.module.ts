import { Module } from '@nestjs/common';
import { EssencesModule } from './modules/essences/essences.module';
import { ClientsModule } from './infra/clients/clients.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppConstants } from './app.constants';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: Number(configService.get(AppConstants.CACHE_TTL)),
        host: configService.get(AppConstants.REDIS_HOST),
        port: Number(configService.get(AppConstants.REDIS_PORT)),
      }),
    }),
    ClientsModule,
    EssencesModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: CacheInterceptor }],
})
export class AppModule {}
