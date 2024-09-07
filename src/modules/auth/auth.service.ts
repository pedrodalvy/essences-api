import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpInput } from './dto/sign-up.input';
import { SignInOutput } from './dto/sign-in.output';
import { SignInInput } from './dto/sign-in.input';
import { CacheClientInterface } from '../../infra/clients/cache-client/cache.client.interface';
import { CacheClient } from '../../infra/clients/cache-client/cache.client';
import { AuthConstants } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CacheClient) private readonly cacheClient: CacheClientInterface,
  ) {}

  async signUp({ user, password }: SignUpInput): Promise<void> {
    const key = `${AuthConstants.CACHE_PREFIX}:${user}`;
    const credential = await this.cacheClient.get(key);

    if (credential) {
      throw new BadRequestException('User already exists');
    }

    await this.cacheClient.set({ key, value: password });
  }

  async signIn({ user, password }: SignInInput): Promise<SignInOutput> {
    const key = `${AuthConstants.CACHE_PREFIX}:${user}`;
    const credential = await this.cacheClient.get(key);

    if (!credential || credential !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      token: 'token',
      ttl: 3600,
    };
  }
}
