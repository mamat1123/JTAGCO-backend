import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { EventStatus } from '../entities/event.entity';
import { Type } from 'class-transformer';

class ProductDto {
  @IsString()
  @IsNotEmpty()
  variant_id: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  company_id: string;

  @IsNotEmpty()
  @IsString()
  main_type_id: string;

  @IsNotEmpty()
  @IsString()
  sub_type_id: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  scheduled_at: string;

  @IsOptional()
  @IsString()
  test_start_at?: string;

  @IsOptional()
  @IsString()
  test_end_at?: string;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @IsOptional()
  @IsString()
  customer_id?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  image_urls?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products?: ProductDto[];
} 