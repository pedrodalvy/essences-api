import { Module } from '@nestjs/common';
import { EssencesController } from './essences.controller';
import { EssencesService } from './essences.service';
import { ClientsModule } from '../../infra/adapters/clients.module';

@Module({
  imports: [ClientsModule],
  controllers: [EssencesController],
  providers: [EssencesService],
})
export class EssencesModule {}
