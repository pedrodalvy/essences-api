import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BadRequestError, InternalServerError, UnauthorizedError } from '../../swagger.errors';
import { SignInOutput } from '../../../../modules/auth/dto/sign-in.output';
import { SignInInput } from '../../../../modules/auth/dto/sign-in.input';

export const SignInSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Sign in' }),
    ApiBody({ type: SignInInput }),
    ApiOkResponse({ description: 'User signed in', type: SignInOutput }),
    ApiUnauthorizedResponse({ description: 'Unauthorized', type: UnauthorizedError }),
    ApiBadRequestResponse({ description: 'Bad request', type: BadRequestError }),
    ApiInternalServerErrorResponse({ description: 'Internal server error', type: InternalServerError }),
  );
