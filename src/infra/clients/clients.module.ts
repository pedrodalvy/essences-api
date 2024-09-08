import { Module } from '@nestjs/common';
import { GBClient } from './gb-client/gb.client';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CacheClient } from './cache-client/cache.client';
import { EncryptionClient } from './encryption-client/encryption.client';
import { JwtModule } from '@nestjs/jwt';
import { JwtClient } from './jwt-client/jwt.client';

@Module({
  imports: [HttpModule, ConfigModule, JwtModule],
  providers: [GBClient, CacheClient, EncryptionClient, JwtClient],
  exports: [GBClient, CacheClient, EncryptionClient, JwtClient],
})
export class ClientsModule {}
