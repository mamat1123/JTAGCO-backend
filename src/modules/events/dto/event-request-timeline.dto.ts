import { ApiProperty } from '@nestjs/swagger';
import { ShoeRequestDto } from 'src/modules/shoe-requests/dto/shoe-request.dto';

export enum StepStatus {
  COMPLETED = 'completed',
  CURRENT = 'current',
  PENDING = 'pending',
}

export class ProductVariantInfo {
  @ApiProperty({ description: 'Product variant ID' })
  id: string;

  @ApiProperty({ description: 'Product variant SKU' })
  sku: string;

  @ApiProperty({ description: 'Product variant attributes' })
  attributes: any;

  @ApiProperty({ description: 'Product variant price' })
  price: number;

  @ApiProperty({ description: 'Product variant stock' })
  stock: number;

  @ApiProperty({ description: 'Product information' })
  products: {
    id: string;
    name: string;
  };
}

export class ShoeRequestWithProductVariantDto extends ShoeRequestDto {
  @ApiProperty({ description: 'Product variant information' })
  product_variants: ProductVariantInfo;
}

export class Step {
  @ApiProperty({ description: 'Step ID' })
  id: number;

  @ApiProperty({ description: 'Step title' })
  title: string;

  @ApiProperty({ description: 'Step description' })
  description: string;

  @ApiProperty({ description: 'Step date in format dd MMM yyyy' })
  date: string;

  @ApiProperty({ description: 'Step status', enum: StepStatus })
  status: StepStatus;

  @ApiProperty({ description: 'Step data with product variant information' })
  data?: ShoeRequestWithProductVariantDto[];
}
