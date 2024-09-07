import { Module } from '@nestjs/common';
import { GBClient } from './gb-client/gb.client';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CacheClient } from './cache-client/cache.client';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [GBClient, CacheClient],
  exports: [GBClient, CacheClient],
})
export class ClientsModule {}
