import { ApiProperty } from '@nestjs/swagger';

export class DescribeEssenceOutput {
  @ApiProperty({ description: 'ID of the essence', example: 'SI' })
  id: string;

  @ApiProperty({ description: 'Name of the essence', example: 'Somos inquietos' })
  name: string;

  @ApiProperty({
    description: 'Values of the essence',
    example: ['AUTODESENVOLVIMENTO', 'EMPREENDEDORISMO', 'ADAPTABILIDADE'],
    isArray: true,
  })
  values: string[];
}
