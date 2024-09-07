import { Body, Controller, Post } from '@nestjs/common';
import { SignUpInput } from './dto/sign-up.input';
import { AuthService } from './auth.service';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() input: SignUpInput): Promise<void> {
    return this.authService.signUp(input);
  }
}
