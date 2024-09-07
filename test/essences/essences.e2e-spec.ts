import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { mock } from 'jest-mock-extended';
import { EssencesService } from '../../src/modules/essences/essences.service';
import { listEssencesOutputMock } from '../../src/modules/essences/tests/mocks/list-essences.output.mock';
import { appConfig } from '../../src/app.config';
import { describeEssenceOutputMock } from '../../src/modules/essences/tests/mocks/describe-essence.output.mock';

describe('Essences (E2E)', () => {
  let app: INestApplication;
  const essencesService = mock<EssencesService>();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EssencesService)
      .useValue(essencesService)
      .compile();

    app = moduleFixture.createNestApplication();
    appConfig(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('listEssences (GET)', () => {
    it('should list essences with success', async () => {
      // ARRANGE
      const expectedOutput = listEssencesOutputMock();
      essencesService.listEssences.mockResolvedValue(expectedOutput);

      // ACT
      const response = await request(app.getHttpServer()).get(
        '/api/v1/essences',
      );

      // ASSERT
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(expectedOutput);
    });
  });

  describe('describeEssence (GET)', () => {
    it('should describe essence with success', async () => {
      // ARRANGE
      const expectedOutput = describeEssenceOutputMock();
      essencesService.describeEssence.mockResolvedValue(expectedOutput);

      // ACT
      const response = await request(app.getHttpServer()).get(
        '/api/v1/essences/SI',
      );

      // ASSERT
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(expectedOutput);
    });
  });
});
