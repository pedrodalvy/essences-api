import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { EssencesService } from './essences.service';
import { ListEssencesOutput } from './dto/list-essences.output';
import { DescribeEssenceOutput } from './dto/describe-essence.output';
import { AuthGuard } from '../auth/auth.guard';

@Controller({ path: 'essences', version: '1' })
@UseGuards(AuthGuard)
export class EssencesController {
  constructor(private readonly essencesService: EssencesService) {}

  @Get()
  listEssences(): Promise<ListEssencesOutput[]> {
    return this.essencesService.listEssences();
  }

  @Get(':id')
  describeEssence(@Param('id') id: string): Promise<DescribeEssenceOutput> {
    return this.essencesService.describeEssence(id);
  }
}
