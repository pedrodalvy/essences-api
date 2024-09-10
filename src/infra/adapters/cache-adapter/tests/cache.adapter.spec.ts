import { Test } from '@nestjs/testing';
import { CacheAdapterInterface } from '../cache.adapter.interface';
import { Cache } from 'cache-manager';
import { mock } from 'jest-mock-extended';
import { CacheAdapter } from '../cache.adapter';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('CacheAdapter', () => {
  let cacheAdapter: CacheAdapterInterface;
  const cacheManager = mock<Cache>();

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [CacheAdapter, { provide: CACHE_MANAGER, useValue: cacheManager }],
    }).compile();

    cacheAdapter = app.get<CacheAdapterInterface>(CacheAdapter);
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
      await cacheAdapter.set(input);

      // ASSERT
      expect(cacheManager.set).toHaveBeenCalledWith(input.key, input.value, input.ttl);
    });
  });

  describe('get', () => {
    it('should get cache with success', async () => {
      // ARRANGE
      const key = 'any-key';
      const expectedValue = 'any-value';

      cacheManager.get.mockResolvedValue(expectedValue);

      // ACT
      const result = await cacheAdapter.get(key);

      // ASSERT
      expect(result).toEqual(expectedValue);
    });
  });
});
