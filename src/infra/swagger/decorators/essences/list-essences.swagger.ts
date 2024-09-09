import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ListEssencesOutput } from '../../../../modules/essences/dto/list-essences.output';
import { InternalServerError, UnauthorizedError } from '../../swagger.errors';

export const ListEssencesSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'List all essences' }),
    ApiHeaders([{ name: 'Authorization', description: 'Bearer token' }]),
    ApiBearerAuth(),
    ApiOkResponse({ description: 'A list of essences', type: ListEssencesOutput, isArray: true }),
    ApiUnauthorizedResponse({ description: 'Unauthorized', type: UnauthorizedError }),
    ApiInternalServerErrorResponse({ description: 'Internal server error', type: InternalServerError }),
  );
