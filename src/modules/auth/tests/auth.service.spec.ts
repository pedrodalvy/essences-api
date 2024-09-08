import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CacheClientInterface } from '../../../infra/clients/cache-client/cache.client.interface';
import { mock } from 'jest-mock-extended';
import { CacheClient } from '../../../infra/clients/cache-client/cache.client';
import { AuthConstants } from '../auth.constants';
import { EncryptionClientInterface } from '../../../infra/clients/encryption-client/encryption.client.interface';
import { EncryptionClient } from '../../../infra/clients/encryption-client/encryption.client';
import { JwtClientInterface } from '../../../infra/clients/jwt-client/jwt.client.interface';
import { JwtClient } from '../../../infra/clients/jwt-client/jwt.client';

describe('AuthService', () => {
  let authService: AuthService;
  const cacheClient = mock<CacheClientInterface>();
  const encryptionClient = mock<EncryptionClientInterface>();
  const jwtClient = mock<JwtClientInterface>();

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: CacheClient, useValue: cacheClient },
        { provide: EncryptionClient, useValue: encryptionClient },
        { provide: JwtClient, useValue: jwtClient },
      ],
    }).compile();

    authService = app.get(AuthService);
  });

  describe('signUp', () => {
    it('should sign up with success', async () => {
      // ARRANGE
      const input = { user: 'user', password: 'password' };
      const expectedCacheKey = `${AuthConstants.CACHE_PREFIX}:${input.user}`;
      encryptionClient.encrypt.mockResolvedValueOnce(input.password);

      // ACT
      await authService.signUp(input);

      // ASSERT
      expect(cacheClient.set).toHaveBeenCalledWith({
        key: expectedCacheKey,
        value: input.password,
      });
    });

    it('should throw a bad request error when user already exists', async () => {
      // ARRANGE
      const input = { user: 'user', password: 'password' };
      await authService.signUp(input);
      cacheClient.get.mockResolvedValueOnce(input.password);

      const expectedError = new BadRequestException('User already exists');

      // ACT
      const promise = authService.signUp(input);

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });

  describe('signIn', () => {
    it('should sign in with success', async () => {
      // ARRANGE
      const input = { user: 'user', password: 'password' };

      const expectedCacheKey = `${AuthConstants.CACHE_PREFIX}:${input.user}`;
      cacheClient.get.mockResolvedValueOnce(input.password);
      encryptionClient.compare.mockResolvedValueOnce(true);

      const expectedOutput = { token: 'token', ttl: 3600 };
      jwtClient.createToken.mockResolvedValueOnce(expectedOutput);

      // ACT
      const result = await authService.signIn(input);

      // ASSERT
      expect(cacheClient.get).toHaveBeenCalledWith(expectedCacheKey);
      expect(result).toEqual(expectedOutput);
    });

    it('should throw a bad request error when credentials are invalid', async () => {
      // ARRANGE
      cacheClient.get.mockResolvedValueOnce('password');
      encryptionClient.compare.mockResolvedValueOnce(false);
      const expectedError = new UnauthorizedException('Invalid credentials');

      // ACT
      const promise = authService.signIn({
        user: 'user',
        password: 'password',
      });

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });

    it('should throw a bad request error when credentials are not found', async () => {
      // ARRANGE
      cacheClient.get.mockResolvedValueOnce(undefined);
      const expectedError = new BadRequestException('Invalid credentials');

      // ACT
      const promise = authService.signIn({
        user: 'user',
        password: 'password',
      });

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });
});
