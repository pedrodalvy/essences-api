import { JwtAdapterInterface } from './jwt.adapter.interface';
import { CreateTokenInput } from './dto/create-token.input';
import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger } from '@nestjs/common';
import { CreateTokenOutput } from './dto/create-token.output';
import { ConfigService } from '@nestjs/config';
import { JwtAdapterConstants } from './jwt.adapter.constants';

@Injectable()
export class JwtAdapter implements JwtAdapterInterface {
  private readonly logger = new Logger(JwtAdapter.name);

  private readonly jwtSecret: string;
  private readonly jwtTTL: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get(JwtAdapterConstants.SECRET);
    this.jwtTTL = Number(this.configService.get(JwtAdapterConstants.TTL));
  }

  async createToken(payload: CreateTokenInput): Promise<CreateTokenOutput> {
    this.logger.log({ message: 'createToken - Start' });

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.jwtTTL,
      secret: this.jwtSecret,
    });

    const output = { token, ttl: this.jwtTTL };

    this.logger.log({ message: 'createToken - End' });
    return output;
  }

  async verifyToken(token: string): Promise<boolean> {
    this.logger.log({ message: 'verifyToken - Start' });

    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });
    } catch (error: any) {
      this.logger.error({ message: 'verifyToken - Failed to verify token', error });
      return false;
    }

    this.logger.log({ message: 'verifyToken - End' });
    return true;
  }
}
