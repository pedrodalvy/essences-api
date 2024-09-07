import { SetCacheKeyInput } from './dto/set-cache-key.input';

export interface CacheClientInterface {
  get(key: string): Promise<string | undefined>;
  set(input: SetCacheKeyInput): Promise<void>;
}
