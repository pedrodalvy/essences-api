import { CacheClientInterface } from './cache.client.interface';
import { SetCacheKeyInput } from './dto/set-cache-key.input';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheClient implements CacheClientInterface {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(key: string): Promise<string | undefined> {
    return this.cacheManager.get<string>(key);
  }

  async set({ key, value, ttl }: SetCacheKeyInput): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }
}
