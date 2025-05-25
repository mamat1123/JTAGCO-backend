import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ProductType } from '../entities/product.entity';

export class CreateProductDto {
  @IsEnum(ProductType)
  @IsNotEmpty()
  type: ProductType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
} 