import { Module } from '@nestjs/common';
import { EssencesController } from './essences.controller';
import { EssencesService } from './essences.service';

@Module({
  controllers: [EssencesController],
  providers: [EssencesService],
})
export class EssencesModule {}
