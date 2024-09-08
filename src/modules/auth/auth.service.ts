import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpInput } from './dto/sign-up.input';
import { SignInOutput } from './dto/sign-in.output';
import { SignInInput } from './dto/sign-in.input';
import { CacheClientInterface } from '../../infra/clients/cache-client/cache.client.interface';
import { CacheClient } from '../../infra/clients/cache-client/cache.client';
import { AuthConstants } from './auth.constants';
import { EncryptionClient } from '../../infra/clients/encryption-client/encryption.client';
import { EncryptionClientInterface } from '../../infra/clients/encryption-client/encryption.client.interface';
import { JwtClient } from '../../infra/clients/jwt-client/jwt.client';
import { JwtClientInterface } from '../../infra/clients/jwt-client/jwt.client.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(CacheClient)
    private readonly cacheClient: CacheClientInterface,

    @Inject(EncryptionClient)
    private readonly encryptionClient: EncryptionClientInterface,

    @Inject(JwtClient)
    private readonly jwtClient: JwtClientInterface,
  ) {}

  async signUp({ user, password }: SignUpInput): Promise<void> {
    this.logger.log({ message: 'signUp - Start' });

    const key = `${AuthConstants.CACHE_PREFIX}:${user}`;
    const credential = await this.cacheClient.get(key);

    if (credential) {
      this.logger.error({ message: 'signUp - User already exists' });
      throw new BadRequestException('User already exists');
    }

    const encryptedPassword = await this.encryptionClient.encrypt(password);
    await this.cacheClient.set({ key, value: encryptedPassword });
    this.logger.log({ message: 'signUp - End' });
  }

  async signIn({ user, password }: SignInInput): Promise<SignInOutput> {
    this.logger.log({ message: 'signIn - Start' });

    const key = `${AuthConstants.CACHE_PREFIX}:${user}`;
    const credential = await this.cacheClient.get(key);

    if (!credential) {
      this.logger.error({ message: 'signIn - Invalid credentials' });
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await this.encryptionClient.compare({
      value: password,
      hash: credential,
    });

    if (!isValidPassword) {
      this.logger.error({ message: 'signIn - Invalid credentials' });
      throw new UnauthorizedException('Invalid credentials');
    }

    const output = await this.jwtClient.createToken({ sub: user });

    this.logger.log({ message: 'signIn - End' });
    return output;
  }
}
