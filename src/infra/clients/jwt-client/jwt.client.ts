import { JwtClientInterface } from './jwt.client.interface';
import { CreateTokenInput } from './dto/create-token.input';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { CreateTokenOutput } from './dto/create-token.output';
import { ConfigService } from '@nestjs/config';
import { JwtClientConstants } from './jwt.client.constants';

@Injectable()
export class JwtClient implements JwtClientInterface {
  private readonly jwtSecret: string;
  private readonly jwtTTL: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get(JwtClientConstants.SECRET);
    this.jwtTTL = Number(this.configService.get(JwtClientConstants.TTL));
  }

  async createToken(payload: CreateTokenInput): Promise<CreateTokenOutput> {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.jwtTTL,
      secret: this.jwtSecret,
    });

    return { token, ttl: this.jwtTTL };
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });
    } catch {
      return false;
    }

    return true;
  }
}
