import { Module } from '@nestjs/common';
import { EssencesModule } from './modules/essences/essences.module';

@Module({
  imports: [EssencesModule],
})
export class AppModule {}
