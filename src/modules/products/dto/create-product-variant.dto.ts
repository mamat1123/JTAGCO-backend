import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductVariantAttributes } from '../entities/product-variant.entity';

export class CreateProductVariantDto {
  @IsUUID()
  @IsNotEmpty()
  product_id: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  attributes?: ProductVariantAttributes;

  @IsBoolean()
  @IsOptional()
  is_made_to_order?: boolean;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  stock: number;
} 