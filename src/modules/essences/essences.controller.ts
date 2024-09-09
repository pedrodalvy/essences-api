import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { EssencesService } from './essences.service';
import { ListEssencesOutput } from './dto/list-essences.output';
import { DescribeEssenceOutput } from './dto/describe-essence.output';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ListEssencesSwagger } from '../../infra/swagger/decorators/essences/list-essences.swagger';
import { DescribeEssenceSwagger } from '../../infra/swagger/decorators/essences/describe-essence.swagger';

@Controller({ path: 'essences', version: '1' })
@UseGuards(AuthGuard)
@ApiTags('Essences')
export class EssencesController {
  constructor(private readonly essencesService: EssencesService) {}

  @Get()
  @ListEssencesSwagger()
  listEssences(): Promise<ListEssencesOutput[]> {
    return this.essencesService.listEssences();
  }

  @Get(':id')
  @DescribeEssenceSwagger()
  describeEssence(@Param('id') id: string): Promise<DescribeEssenceOutput> {
    return this.essencesService.describeEssence(id);
  }
}
