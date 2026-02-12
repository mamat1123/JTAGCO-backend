import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TaggedProductDto {
  @IsNotEmpty()
  @IsUUID('4')
  @ApiProperty({ description: 'Product ID' })
  product_id: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Price for this product in the event' })
  price: number;
}
