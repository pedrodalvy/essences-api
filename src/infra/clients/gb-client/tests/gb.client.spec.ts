import { mock } from 'jest-mock-extended';
import { Test } from '@nestjs/testing';
import { GBClientInterface } from '../gb.client.interface';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { GBClient } from '../gb.client';
import { listEssencesOutputMock } from '../../../../modules/essences/tests/mocks/list-essences.output.mock';
import { axiosResponseMock } from './mocks/axios.response.mock';
import { GBClientConstants } from '../gb.client.constants';
import { describeEssenceOutputMock } from '../../../../modules/essences/tests/mocks/describe-essence.output.mock';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { HttpStatus, InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('GBClient', () => {
  let gbClient: GBClientInterface;
  const httpService = mock<HttpService>();

  const mockedURL = 'mocked-url';
  const mockedToken = 'mocked-token';

  const configService = mock<ConfigService>({
    get: jest.fn((key: string) => {
      return key === GBClientConstants.AUTH_TOKEN ? mockedToken : mockedURL;
    }),
  });

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        GBClient,
        { provide: HttpService, useValue: httpService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    gbClient = app.get<GBClientInterface>(GBClient);
  });

  describe('listEssences', () => {
    it('should list essences with success', async () => {
      // ARRANGE
      const expectedOutput = listEssencesOutputMock();
      httpService.get.mockImplementationOnce(() => axiosResponseMock({ responseData: expectedOutput }));

      // ACT
      const result = await gbClient.listEssences();

      // ASSERT
      expect(result).toEqual(expectedOutput);
    });

    it('should call api wit correct config params', async () => {
      // ARRANGE
      httpService.get.mockImplementationOnce(() => axiosResponseMock({ responseData: {} }));

      const expectedURL = `${mockedURL}/v1/essences-challenge/essences`;

      // ACT
      await gbClient.listEssences();

      // ASSERT
      expect(httpService.get).toHaveBeenCalledWith(expectedURL, {
        headers: { Authorization: `Basic ${mockedToken}` },
      });
    });
  });

  describe('describeEssence', () => {
    it('should describe essence with success', async () => {
      // ARRANGE
      const expectedOutput = describeEssenceOutputMock();
      httpService.get.mockImplementationOnce(() => axiosResponseMock({ responseData: expectedOutput }));

      // ACT
      const result = await gbClient.describeEssence('any-id');

      // ASSERT
      expect(result).toEqual(expectedOutput);
    });

    it('should call api wit correct config params', async () => {
      // ARRANGE
      httpService.get.mockImplementationOnce(() => axiosResponseMock({ responseData: {} }));

      const id = 'essence-id';
      const expectedURL = `${mockedURL}/v1/essences-challenge/essences/${id}`;

      // ACT
      await gbClient.describeEssence(id);

      // ASSERT
      expect(httpService.get).toHaveBeenCalledWith(expectedURL, {
        headers: { Authorization: `Basic ${mockedToken}` },
      });
    });

    it('should throw NotFoundException when api returns 404', async () => {
      // ARRANGE
      const errorMock = new AxiosError('', '', {} as InternalAxiosRequestConfig, {}, {
        status: HttpStatus.NOT_FOUND,
      } as AxiosResponse);

      httpService.get.mockImplementationOnce(() => {
        throw errorMock;
      });

      // ACT
      const promise = gbClient.describeEssence('any-id');

      // ASSERT
      await expect(promise).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException when api returns any other error', async () => {
      // ARRANGE
      const errorMock = new AxiosError('', '', {} as InternalAxiosRequestConfig, {}, {
        status: HttpStatus.UNAUTHORIZED,
      } as AxiosResponse);

      httpService.get.mockImplementationOnce(() => {
        throw errorMock;
      });

      // ACT
      const promise = gbClient.describeEssence('any-id');

      // ASSERT
      await expect(promise).rejects.toThrow(InternalServerErrorException);
    });
  });
});
