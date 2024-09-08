import { IsAlpha, IsString } from 'class-validator';

export class SignInInput {
  @IsAlpha()
  user: string;

  @IsString()
  password: string;
}
