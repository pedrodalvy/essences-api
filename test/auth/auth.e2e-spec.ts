import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { appConfig } from '../../src/app.config';
import * as request from 'supertest';

describe('Auth (E2E)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appConfig(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('signUp (POST)', () => {
    it('should sign up with success', async () => {
      // ARRANGE
      const input = { user: 'user', password: 'password' };
      const endpoint = '/api/v1/auth/sign-up';

      // ACT
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send(input);

      // ASSERT
      expect(response.status).toBe(HttpStatus.CREATED);
    });

    it('should throw a bad request error when user already exists', async () => {
      // ARRANGE
      const input = { user: 'user', password: 'password' };
      const endpoint = '/api/v1/auth/sign-up';

      await request(app.getHttpServer()).post(endpoint).send(input);

      // ACT
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send(input);

      // ASSERT
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toBe('User already exists');
    });
  });
});
