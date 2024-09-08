import { Module } from '@nestjs/common';
import { GBClient } from './gb-client/gb.client';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CacheClient } from './cache-client/cache.client';
import { EncryptionClient } from './encryption-client/encryption.client';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [GBClient, CacheClient, EncryptionClient],
  exports: [GBClient, CacheClient, EncryptionClient],
})
export class ClientsModule {}
