import { Controller, Get } from '@nestjs/common';
import { EssencesService } from './essences.service';
import { ListEssencesOutput } from './dto/list-essences.output';
import { DescribeEssenceOutput } from './dto/describe-essence.output';

@Controller({ path: 'essences', version: '1' })
export class EssencesController {
  constructor(private readonly essencesService: EssencesService) {}

  @Get()
  listEssences(): Promise<ListEssencesOutput[]> {
    return this.essencesService.listEssences();
  }

  @Get(':id')
  describeEssence(id: string): Promise<DescribeEssenceOutput> {
    return this.essencesService.describeEssence(id);
  }
}
