import { Module } from '@nestjs/common';
import { GBClient } from './gb-client/gb.client';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [GBClient],
  exports: [GBClient],
})
export class ClientsModule {}
