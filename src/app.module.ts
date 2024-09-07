import { Module } from '@nestjs/common';
import { EssencesModule } from './modules/essences/essences.module';
import { ClientsModule } from './infra/clients/clients.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), ClientsModule, EssencesModule],
})
export class AppModule {}
