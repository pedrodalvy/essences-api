import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignUpInput } from './dto/sign-up.input';
import { AuthService } from './auth.service';
import { SignInOutput } from './dto/sign-in.output';
import { SignInInput } from './dto/sign-in.input';
import { SignInSwagger } from '../../infra/swagger/decorators/auth/sign-in.swagger';
import { SignUpSwagger } from '../../infra/swagger/decorators/auth/sign-up.swagger';
import { ApiTags } from '@nestjs/swagger';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @SignUpSwagger()
  signUp(@Body() input: SignUpInput): Promise<void> {
    return this.authService.signUp(input);
  }

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  @SignInSwagger()
  signIn(@Body() input: SignInInput): Promise<SignInOutput> {
    return this.authService.signIn(input);
  }
}
