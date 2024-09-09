import { IsAlpha, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInInput {
  @ApiProperty({ description: 'User name', example: 'AnyUser' })
  @IsAlpha()
  user: string;

  @ApiProperty({ description: 'User password', example: 'AnyPassword' })
  @IsString()
  password: string;
}
