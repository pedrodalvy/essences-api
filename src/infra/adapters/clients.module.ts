import { Module } from '@nestjs/common';
import { GbClientAdapter } from './gb-client-adapter/gb-client.adapter';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CacheAdapter } from './cache-adapter/cache.adapter';
import { EncryptionAdapter } from './encryption-adapter/encryption.adapter';
import { JwtModule } from '@nestjs/jwt';
import { JwtAdapter } from './jwt-adapter/jwt.adapter';

@Module({
  imports: [HttpModule, ConfigModule, JwtModule],
  providers: [GbClientAdapter, CacheAdapter, EncryptionAdapter, JwtAdapter],
  exports: [GbClientAdapter, CacheAdapter, EncryptionAdapter, JwtAdapter],
})
export class ClientsModule {}
