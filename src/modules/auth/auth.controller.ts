import { Body, Controller, Post } from '@nestjs/common';
import { SignUpInput } from './dto/sign-up.input';
import { AuthService } from './auth.service';
import { SignInOutput } from './dto/sign-in.output';
import { SignInInput } from './dto/sign-in.input';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() input: SignUpInput): Promise<void> {
    return this.authService.signUp(input);
  }

  @Post('/sign-in')
  signIn(@Body() input: SignInInput): Promise<SignInOutput> {
    return this.authService.signIn(input);
  }
}
