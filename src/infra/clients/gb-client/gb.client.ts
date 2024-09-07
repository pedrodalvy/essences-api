import { ListEssencesOutputInterface } from './dto/list-essences.output.interface';
import { GBClientInterface } from './gb.client.interface';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { GBClientConstants } from './gb.client.constants';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GBClient implements GBClientInterface {
  private readonly authToken: string;
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authToken = this.configService.get(GBClientConstants.AUTH_TOKEN);
    this.baseUrl = this.configService.get(GBClientConstants.BASE_URL);
  }

  async listEssences(): Promise<ListEssencesOutputInterface[]> {
    const apiURL = `${this.baseUrl}/v1/essences-challenge/essences`;
    const { data } = await firstValueFrom(
      this.httpService.get<ListEssencesOutputInterface[]>(apiURL, {
        headers: { Authorization: `Basic ${this.authToken}` },
      }),
    );

    return data;
  }
}
