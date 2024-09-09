import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { InternalServerError, NotFoundError, UnauthorizedError } from '../../swagger.errors';
import { DescribeEssenceOutput } from '../../../../modules/essences/dto/describe-essence.output';

export const DescribeEssenceSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Describe an specific essence by id' }),
    ApiHeaders([{ name: 'Authorization', description: 'Bearer token' }]),
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Description of an essence', type: DescribeEssenceOutput }),
    ApiUnauthorizedResponse({ description: 'Unauthorized', type: UnauthorizedError }),
    ApiNotFoundResponse({ description: 'Not found', type: NotFoundError }),
    ApiInternalServerErrorResponse({ description: 'Internal server error', type: InternalServerError }),
  );
