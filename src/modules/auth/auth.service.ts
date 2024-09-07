import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpInput } from './dto/sign-up.input';

@Injectable()
export class AuthService {
  users: { [key: string]: string } = {};

  async signUp(input: SignUpInput): Promise<void> {
    if (this.users[input.user]) {
      throw new BadRequestException('User already exists');
    }

    this.users[input.user] = input.password;
  }
}
