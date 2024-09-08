import { Inject, Injectable, Logger } from '@nestjs/common';
import { ListEssencesOutput } from './dto/list-essences.output';
import { DescribeEssenceOutput } from './dto/describe-essence.output';
import { GBClientInterface } from '../../infra/clients/gb-client/gb.client.interface';
import { GBClient } from '../../infra/clients/gb-client/gb.client';

@Injectable()
export class EssencesService {
  private readonly logger = new Logger(EssencesService.name);

  constructor(@Inject(GBClient) private readonly gbClient: GBClientInterface) {}

  async listEssences(): Promise<ListEssencesOutput[]> {
    this.logger.log({ message: 'listEssences - Start' });

    const essences = await this.gbClient.listEssences();

    this.logger.log({ message: 'listEssences - End' });
    return essences;
  }

  async describeEssence(id: string): Promise<DescribeEssenceOutput> {
    this.logger.log({ message: 'describeEssence - Start' });

    const essence = await this.gbClient.describeEssence(id);

    this.logger.log({ message: 'describeEssence - End' });
    return essence;
  }
}
