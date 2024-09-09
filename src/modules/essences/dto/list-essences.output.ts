import { ApiProperty } from '@nestjs/swagger';

export class ListEssencesOutput {
  @ApiProperty({ description: 'ID of the essence', example: 'SI' })
  id: string;

  @ApiProperty({ description: 'Name of the essence', example: 'Somos inquietos' })
  name: string;
}
