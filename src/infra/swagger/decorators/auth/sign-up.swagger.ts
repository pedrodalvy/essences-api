import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BadRequestError, InternalServerError, UnauthorizedError } from '../../swagger.errors';
import { SignUpInput } from '../../../../modules/auth/dto/sign-up.input';

export const SignUpSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Sign Up' }),
    ApiBody({ type: SignUpInput }),
    ApiCreatedResponse({ description: 'User signed up' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized', type: UnauthorizedError }),
    ApiBadRequestResponse({ description: 'Bad request', type: BadRequestError }),
    ApiInternalServerErrorResponse({ description: 'Internal server error', type: InternalServerError }),
  );
