import { ListEssencesOutputInterface } from './dto/list-essences.output.interface';
import { GBClientInterface } from './gb.client.interface';
import { HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { GBClientConstants } from './gb.client.constants';
import { firstValueFrom } from 'rxjs';
import { DescribeEssenceOutputInterface } from './dto/describe-essence.output.interface';
import { AxiosError } from 'axios';

@Injectable()
export class GBClient implements GBClientInterface {
  private readonly logger = new Logger(GBClient.name);

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
    this.logger.log({ message: 'listEssences - Start' });

    const apiURL = `${this.baseUrl}/v1/essences-challenge/essences`;
    const { data } = await firstValueFrom(
      this.httpService.get<ListEssencesOutputInterface[]>(apiURL, {
        headers: { Authorization: `Basic ${this.authToken}` },
      }),
    );

    this.logger.log({ message: 'listEssences - End' });
    return data;
  }

  async describeEssence(id: string): Promise<DescribeEssenceOutputInterface> {
    this.logger.log({ message: 'describeEssence - Start' });

    const apiURL = `${this.baseUrl}/v1/essences-challenge/essences/${id}`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<DescribeEssenceOutputInterface>(apiURL, {
          headers: { Authorization: `Basic ${this.authToken}` },
        }),
      );

      this.logger.log({ message: 'describeEssence - End' });
      return data;
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError) {
        if (error.response?.status === HttpStatus.NOT_FOUND) {
          throw new NotFoundException('Essence not found');
        }
      }

      this.logger.error({ message: 'describeEssence - Unexpected error to describe essence', error });
      throw new InternalServerErrorException();
    }
  }
}
