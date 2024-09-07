import { Inject, Injectable } from '@nestjs/common';
import { ListEssencesOutput } from './dto/list-essences.output';
import { DescribeEssenceOutput } from './dto/describe-essence.output';
import { GBClientInterface } from '../../infra/clients/gb-client/gb.client.interface';
import { GBClient } from '../../infra/clients/gb-client/gb.client';

@Injectable()
export class EssencesService {
  constructor(@Inject(GBClient) private readonly gbClient: GBClientInterface) {}

  async listEssences(): Promise<ListEssencesOutput[]> {
    return this.gbClient.listEssences();
  }

  async describeEssence(id: string): Promise<DescribeEssenceOutput> {
    return { id } as DescribeEssenceOutput;
  }
}
