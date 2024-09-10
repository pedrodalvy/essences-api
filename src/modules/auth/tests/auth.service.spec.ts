import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CacheAdapterInterface } from '../../../infra/adapters/cache-adapter/cache.adapter.interface';
import { mock } from 'jest-mock-extended';
import { CacheAdapter } from '../../../infra/adapters/cache-adapter/cache.adapter';
import { AuthConstants } from '../auth.constants';
import { EncryptionAdapterInterface } from '../../../infra/adapters/encryption-adapter/encryption.adapter.interface';
import { EncryptionAdapter } from '../../../infra/adapters/encryption-adapter/encryption.adapter';
import { JwtAdapterInterface } from '../../../infra/adapters/jwt-adapter/jwt.adapter.interface';
import { JwtAdapter } from '../../../infra/adapters/jwt-adapter/jwt.adapter';

describe('AuthService', () => {
  let authService: AuthService;
  const cacheAdapter = mock<CacheAdapterInterface>();
  const encryptionAdapter = mock<EncryptionAdapterInterface>();
  const jwtClient = mock<JwtAdapterInterface>();

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: CacheAdapter, useValue: cacheAdapter },
        { provide: EncryptionAdapter, useValue: encryptionAdapter },
        { provide: JwtAdapter, useValue: jwtClient },
      ],
    }).compile();

    authService = app.get(AuthService);
  });

  describe('signUp', () => {
    it('should sign up with success', async () => {
      // ARRANGE
      const input = { user: 'user', password: 'password' };
      const expectedCacheKey = `${AuthConstants.CACHE_PREFIX}:${input.user}`;
      encryptionAdapter.encrypt.mockResolvedValueOnce(input.password);

      // ACT
      await authService.signUp(input);

      // ASSERT
      expect(cacheAdapter.set).toHaveBeenCalledWith({
        key: expectedCacheKey,
        value: input.password,
      });
    });

    it('should throw a bad request error when user already exists', async () => {
      // ARRANGE
      const input = { user: 'user', password: 'password' };
      await authService.signUp(input);
      cacheAdapter.get.mockResolvedValueOnce(input.password);

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
      cacheAdapter.get.mockResolvedValueOnce(input.password);
      encryptionAdapter.compare.mockResolvedValueOnce(true);

      const expectedOutput = { token: 'token', ttl: 3600 };
      jwtClient.createToken.mockResolvedValueOnce(expectedOutput);

      // ACT
      const result = await authService.signIn(input);

      // ASSERT
      expect(cacheAdapter.get).toHaveBeenCalledWith(expectedCacheKey);
      expect(result).toEqual(expectedOutput);
    });

    it('should throw a bad request error when credentials are invalid', async () => {
      // ARRANGE
      cacheAdapter.get.mockResolvedValueOnce('password');
      encryptionAdapter.compare.mockResolvedValueOnce(false);
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
      cacheAdapter.get.mockResolvedValueOnce(undefined);
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
