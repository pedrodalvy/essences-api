import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

interface BaseError {
  statusCode: number;
  message: string | string[];
}

export class InternalServerError implements BaseError {
  @ApiProperty({ description: 'Http status code', example: HttpStatus.INTERNAL_SERVER_ERROR })
  statusCode: number;

  @ApiProperty({ description: 'Error message', example: 'Internal server error' })
  message: string;
}

export class UnauthorizedError implements BaseError {
  @ApiProperty({ description: 'Http status code', example: HttpStatus.UNAUTHORIZED })
  statusCode: number;

  @ApiProperty({ description: 'Error message', example: 'Unauthorized' })
  message: string;
}

export class NotFoundError implements BaseError {
  @ApiProperty({ description: 'Http status code', example: HttpStatus.NOT_FOUND })
  statusCode: number;

  @ApiProperty({ description: 'Error message', example: 'Essence not found' })
  message: string;
}

export class BadRequestError implements BaseError {
  @ApiProperty({ description: 'Http status code', example: HttpStatus.BAD_REQUEST })
  statusCode: number;

  @ApiProperty({ description: 'Error message', example: ['password must be a string'] })
  message: string[];
}
