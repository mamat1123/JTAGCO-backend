import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductSelectionDto {
  @ApiProperty({ description: 'Product ID' })
  @IsOptional()
  @IsString()
  product_id?: string;

  @ApiProperty({ description: 'Product name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Product price' })
  @IsOptional()
  price?: number;

  @ApiProperty({ description: 'Price range' })
  @IsOptional()
  @IsString()
  price_range?: string;
}

export class CreateEventCheckinDto {
  @ApiProperty({
    description: 'Additional details about the check-in',
    required: false,
  })
  @IsOptional()
  @IsString()
  detail?: string;

  @ApiProperty({
    description: 'Array of image URLs for the check-in',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({
    description: 'Product selections for PRESENT check-in',
    type: [ProductSelectionDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSelectionDto)
  product_selections?: ProductSelectionDto[];

  @ApiProperty({ description: 'Delivery duration', required: false })
  @IsOptional()
  @IsString()
  delivery_duration?: string;

  @ApiProperty({
    description: 'Purchase type (monthly/yearly)',
    required: false,
  })
  @IsOptional()
  @IsString()
  purchase_type?: string;

  @ApiProperty({
    description: 'Purchase months',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  purchase_months?: string[];

  @ApiProperty({ description: 'Competitor brand', required: false })
  @IsOptional()
  @IsString()
  competitor_brand?: string;

  @ApiProperty({ description: 'Special requirements', required: false })
  @IsOptional()
  @IsString()
  special_requirements?: string;

  @ApiProperty({ description: 'Test result (pass/fail)', required: false })
  @IsOptional()
  @IsString()
  test_result?: string;

  @ApiProperty({ description: 'Reason for test failure', required: false })
  @IsOptional()
  @IsString()
  test_result_reason?: string;

  @ApiProperty({ description: 'Got job (yes/no)', required: false })
  @IsOptional()
  @IsString()
  got_job?: string;

  @ApiProperty({ description: 'Reason for not getting job', required: false })
  @IsOptional()
  @IsString()
  got_job_reason?: string;

  @ApiProperty({
    description: 'Problem types for FOUND_PROBLEM check-in',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  problem_types?: string[];
}
