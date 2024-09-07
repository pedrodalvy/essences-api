import { Test } from '@nestjs/testing';
import { CacheClientInterface } from '../cache.client.interface';
import { Cache } from 'cache-manager';
import { mock } from 'jest-mock-extended';
import { CacheClient } from '../cache.client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('CacheClient', () => {
  let cacheClient: CacheClientInterface;
  const cacheManager = mock<Cache>();

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        CacheClient,
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    cacheClient = app.get<CacheClientInterface>(CacheClient);
  });

  describe('set', () => {
    it('should set cache with success', async () => {
      // ARRANGE
      const input = {
        key: 'any-key',
        value: 'any-value',
        ttl: 1000,
      };

      // ACT
      await cacheClient.set(input);

      // ASSERT
      expect(cacheManager.set).toHaveBeenCalledWith(
        input.key,
        input.value,
        input.ttl,
      );
    });
  });

  describe('get', () => {
    it('should get cache with success', async () => {
      // ARRANGE
      const key = 'any-key';
      const expectedValue = 'any-value';

      cacheManager.get.mockResolvedValue(expectedValue);

      // ACT
      const result = await cacheClient.get(key);

      // ASSERT
      expect(result).toEqual(expectedValue);
    });
  });
});
