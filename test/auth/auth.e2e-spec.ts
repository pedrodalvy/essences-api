import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app/app.module';
import { appConfig } from '../../src/app/app.config';
import * as request from 'supertest';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AuthConstants } from '../../src/modules/auth/auth.constants';
import { EncryptionClientInterface } from '../../src/infra/clients/encryption-client/encryption.client.interface';
import { EncryptionClient } from '../../src/infra/clients/encryption-client/encryption.client';

describe('Auth (E2E)', () => {
  let app: INestApplication;
  let cacheManager: Cache;
  let encryptionClient: EncryptionClientInterface;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appConfig(app);

    cacheManager = app.get<Cache>(CACHE_MANAGER);
    encryptionClient = app.get<EncryptionClientInterface>(EncryptionClient);
    await app.init();
  });

  afterEach(async () => {
    await cacheManager.reset();
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
      const endpoint = '/api/v1/auth/sign-up';
      const input = { user: 'user', password: 'password' };

      cacheManager.set(
        `${AuthConstants.CACHE_PREFIX}:${input.user}`,
        input.password,
      );

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

  describe('signIn (POST)', () => {
    it('should sign in with success', async () => {
      // ARRANGE
      const endpoint = '/api/v1/auth/sign-in';
      const input = { user: 'user', password: 'password' };

      const encryptedPassword = await encryptionClient.encrypt(input.password);
      cacheManager.set(
        `${AuthConstants.CACHE_PREFIX}:${input.user}`,
        encryptedPassword,
      );

      // ACT
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send(input);

      // ASSERT
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.token).toBeDefined();
      expect(response.body.ttl).toBe(3600);
    });

    it('should try to sign in with invalid credentials', async () => {
      // ARRANGE
      const endpoint = '/api/v1/auth/sign-in';
      const input = { user: 'user', password: 'password' };

      cacheManager.set(
        `${AuthConstants.CACHE_PREFIX}:${input.user}`,
        'invalid',
      );

      // ACT
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send(input);

      // ASSERT
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});
