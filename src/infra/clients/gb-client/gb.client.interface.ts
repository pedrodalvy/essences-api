import { ListEssencesOutputInterface } from './dto/list-essences.output.interface';

export interface GBClientInterface {
  listEssences(): Promise<ListEssencesOutputInterface[]>;
}
