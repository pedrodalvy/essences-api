import { Injectable } from '@nestjs/common';
import { ListEssencesOutput } from './dto/list-essences.output';
import { DescribeEssenceOutput } from './dto/describe-essence.output';

@Injectable()
export class EssencesService {
  async listEssences(): Promise<ListEssencesOutput[]> {
    return [];
  }

  async describeEssence(id: string): Promise<DescribeEssenceOutput> {
    return { id } as DescribeEssenceOutput;
  }
}
