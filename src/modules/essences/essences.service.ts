import { Injectable } from '@nestjs/common';
import { ListEssencesOutput } from './dto/list-essences.output';

@Injectable()
export class EssencesService {
  async listEssences(): Promise<ListEssencesOutput[]> {
    return [];
  }
}
