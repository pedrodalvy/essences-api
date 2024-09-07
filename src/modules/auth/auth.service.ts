import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpInput } from './dto/sign-up.input';
import { SignInOutput } from './dto/sign-in.output';
import { SignInInput } from './dto/sign-in.input';

@Injectable()
export class AuthService {
  credentials: { [key: string]: string } = {};

  async signUp(input: SignUpInput): Promise<void> {
    if (this.credentials[input.user]) {
      throw new BadRequestException('User already exists');
    }

    this.credentials[input.user] = input.password;
  }

  async signIn(input: SignInInput): Promise<SignInOutput> {
    const credential = this.credentials[input.user];

    if (!credential || credential !== input.password) {
      throw new BadRequestException('Invalid credentials');
    }

    return Promise.resolve({
      token: 'token',
      ttl: 3600,
    });
  }
}
