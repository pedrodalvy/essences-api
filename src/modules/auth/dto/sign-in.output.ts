import { ApiProperty } from '@nestjs/swagger';

export class SignInOutput {
  @ApiProperty({ description: 'JWT token', example: 'any-token' })
  token: string;

  @ApiProperty({ description: 'Time to live in seconds', example: 3600 })
  ttl: number;
}
