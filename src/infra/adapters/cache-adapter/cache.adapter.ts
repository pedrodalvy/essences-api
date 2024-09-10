import { CacheAdapterInterface } from './cache.adapter.interface';
import { SetCacheKeyInput } from './dto/set-cache-key.input';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheAdapter implements CacheAdapterInterface {
  private readonly logger = new Logger(CacheAdapter.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(key: string): Promise<string | undefined> {
    this.logger.log({ message: 'get - Start' });

    const output = await this.cacheManager.get<string>(key);

    this.logger.log({ message: 'get - End' });
    return output;
  }

  async set({ key, value, ttl }: SetCacheKeyInput): Promise<void> {
    this.logger.log({ message: 'set - Start' });

    await this.cacheManager.set(key, value, ttl);

    this.logger.log({ message: 'set - End' });
  }
}
