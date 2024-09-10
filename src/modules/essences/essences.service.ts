import { Inject, Injectable, Logger } from '@nestjs/common';
import { ListEssencesOutput } from './dto/list-essences.output';
import { DescribeEssenceOutput } from './dto/describe-essence.output';
import { GbClientAdapterInterface } from '../../infra/adapters/gb-client-adapter/gb-client.adapter.interface';
import { GbClientAdapter } from '../../infra/adapters/gb-client-adapter/gb-client.adapter';

@Injectable()
export class EssencesService {
  private readonly logger = new Logger(EssencesService.name);

  constructor(@Inject(GbClientAdapter) private readonly gbClientAdapter: GbClientAdapterInterface) {}

  async listEssences(): Promise<ListEssencesOutput[]> {
    this.logger.log({ message: 'listEssences - Start' });

    const essences = await this.gbClientAdapter.listEssences();

    this.logger.log({ message: 'listEssences - End' });
    return essences;
  }

  async describeEssence(id: string): Promise<DescribeEssenceOutput> {
    this.logger.log({ message: 'describeEssence - Start' });

    const essence = await this.gbClientAdapter.describeEssence(id);

    this.logger.log({ message: 'describeEssence - End' });
    return essence;
  }
}
