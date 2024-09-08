import { IsAlpha, IsString } from 'class-validator';

export class SignUpInput {
  @IsAlpha()
  user: string;

  @IsString()
  password: string;
}
