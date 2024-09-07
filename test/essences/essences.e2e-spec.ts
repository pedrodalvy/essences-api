import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { mock } from 'jest-mock-extended';
import { listEssencesOutputMock } from '../../src/modules/essences/tests/mocks/list-essences.output.mock';
import { appConfig } from '../../src/app.config';
import { describeEssenceOutputMock } from '../../src/modules/essences/tests/mocks/describe-essence.output.mock';
import { HttpService } from '@nestjs/axios';
import { axiosResponseMock } from '../../src/infra/clients/gb-client/tests/mocks/axios.response.mock';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('Essences (E2E)', () => {
  let app: INestApplication;
  let cacheManager: Cache;
  const httpService = mock<HttpService>();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useValue(httpService)
      .compile();

    app = moduleFixture.createNestApplication();
    appConfig(app);

    cacheManager = app.get<Cache>(CACHE_MANAGER);
    await app.init();
  });

  afterEach(async () => {
    await cacheManager.reset();
    jest.clearAllMocks();
    await app.close();
  });

  describe('listEssences (GET)', () => {
    it('should list essences with success', async () => {
      // ARRANGE
      const expectedOutput = listEssencesOutputMock();
      httpService.get.mockImplementationOnce(() =>
        axiosResponseMock({ responseData: expectedOutput }),
      );

      // ACT
      const response = await request(app.getHttpServer()).get(
        '/api/v1/essences',
      );

      // ASSERT
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(expectedOutput);
    });

    it('should cache the response of list essences', async () => {
      // ARRANGE
      const expectedOutput = listEssencesOutputMock();
      httpService.get.mockImplementationOnce(() =>
        axiosResponseMock({ responseData: expectedOutput }),
      );

      // ACT
      await request(app.getHttpServer()).get('/api/v1/essences');
      await request(app.getHttpServer()).get('/api/v1/essences');
      await request(app.getHttpServer()).get('/api/v1/essences');

      // ASSERT
      expect(httpService.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('describeEssence (GET)', () => {
    it('should describe essence with success', async () => {
      // ARRANGE
      const expectedOutput = describeEssenceOutputMock();
      httpService.get.mockImplementationOnce(() =>
        axiosResponseMock({ responseData: expectedOutput }),
      );

      // ACT
      const response = await request(app.getHttpServer()).get(
        '/api/v1/essences/SI',
      );

      // ASSERT
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(expectedOutput);
    });

    it('should cache the response of describe essence', async () => {
      // ARRANGE
      const expectedOutput = describeEssenceOutputMock();
      httpService.get.mockImplementationOnce(() =>
        axiosResponseMock({ responseData: expectedOutput }),
      );

      // ACT
      await request(app.getHttpServer()).get('/api/v1/essences/SI');
      await request(app.getHttpServer()).get('/api/v1/essences/SI');
      await request(app.getHttpServer()).get('/api/v1/essences/SI');

      // ASSERT
      expect(httpService.get).toHaveBeenCalledTimes(1);
    });
  });
});
