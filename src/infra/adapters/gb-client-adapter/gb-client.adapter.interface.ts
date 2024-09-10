import { ListEssencesOutputInterface } from './dto/list-essences.output.interface';
import { DescribeEssenceOutputInterface } from './dto/describe-essence.output.interface';

export interface GbClientAdapterInterface {
  listEssences(): Promise<ListEssencesOutputInterface[]>;
  describeEssence(id: string): Promise<DescribeEssenceOutputInterface>;
}
