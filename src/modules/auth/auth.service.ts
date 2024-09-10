import { BadRequestException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SignUpInput } from './dto/sign-up.input';
import { SignInOutput } from './dto/sign-in.output';
import { SignInInput } from './dto/sign-in.input';
import { CacheAdapterInterface } from '../../infra/adapters/cache-adapter/cache.adapter.interface';
import { CacheAdapter } from '../../infra/adapters/cache-adapter/cache.adapter';
import { AuthConstants } from './auth.constants';
import { EncryptionAdapter } from '../../infra/adapters/encryption-adapter/encryption.adapter';
import { EncryptionAdapterInterface } from '../../infra/adapters/encryption-adapter/encryption.adapter.interface';
import { JwtAdapter } from '../../infra/adapters/jwt-adapter/jwt.adapter';
import { JwtAdapterInterface } from '../../infra/adapters/jwt-adapter/jwt.adapter.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(CacheAdapter)
    private readonly cacheAdapter: CacheAdapterInterface,

    @Inject(EncryptionAdapter)
    private readonly encryptionAdapter: EncryptionAdapterInterface,

    @Inject(JwtAdapter)
    private readonly jwtAdapter: JwtAdapterInterface,
  ) {}

  async signUp({ user, password }: SignUpInput): Promise<void> {
    this.logger.log({ message: 'signUp - Start' });

    const key = `${AuthConstants.CACHE_PREFIX}:${user}`;
    const credential = await this.cacheAdapter.get(key);

    if (credential) {
      this.logger.error({ message: 'signUp - User already exists' });
      throw new BadRequestException('User already exists');
    }

    const encryptedPassword = await this.encryptionAdapter.encrypt(password);
    await this.cacheAdapter.set({ key, value: encryptedPassword });
    this.logger.log({ message: 'signUp - End' });
  }

  async signIn({ user, password }: SignInInput): Promise<SignInOutput> {
    this.logger.log({ message: 'signIn - Start' });

    const key = `${AuthConstants.CACHE_PREFIX}:${user}`;
    const credential = await this.cacheAdapter.get(key);

    if (!credential) {
      this.logger.error({ message: 'signIn - Invalid credentials' });
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await this.encryptionAdapter.compare({
      value: password,
      hash: credential,
    });

    if (!isValidPassword) {
      this.logger.error({ message: 'signIn - Invalid credentials' });
      throw new UnauthorizedException('Invalid credentials');
    }

    const output = await this.jwtAdapter.createToken({ sub: user });

    this.logger.log({ message: 'signIn - End' });
    return output;
  }
}
