import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtAdapter } from '../../infra/adapters/jwt-adapter/jwt.adapter';
import { JwtAdapterInterface } from '../../infra/adapters/jwt-adapter/jwt.adapter.interface';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(JwtAdapter)
    private readonly jwtAdapter: JwtAdapterInterface,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    const isValidToken = await this.jwtAdapter.verifyToken(token);
    if (!isValidToken) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
