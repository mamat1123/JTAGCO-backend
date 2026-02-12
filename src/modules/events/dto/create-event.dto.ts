import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { EventStatus } from '../entities/event.entity';
import { Type } from 'class-transformer';
import { CreateShoeRequestDto } from '../../shoe-requests/dto/create-shoe-request.dto';
import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { TaggedProductDto } from './tagged-product.dto';

export class CreateShoeRequestWithoutEventDto extends OmitType(
  CreateShoeRequestDto,
  ['event_id'] as const,
) {}

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Company ID for the event' })
  company_id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Main event type ID' })
  main_type_id: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Sub event type ID', required: false })
  sub_type_id?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Event description', required: false })
  description?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Scheduled date for the event (YYYY-MM-DD)' })
  scheduled_at: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Test start date (YYYY-MM-DD)', required: false })
  test_start_at?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Test end date (YYYY-MM-DD)', required: false })
  test_end_at?: string;

  @IsOptional()
  @IsEnum(EventStatus)
  @ApiProperty({
    description: 'Event status',
    enum: EventStatus,
    required: false,
  })
  status?: EventStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Customer ID', required: false })
  customer_id?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Array of image URLs',
    required: false,
    type: [String],
  })
  image_urls?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShoeRequestWithoutEventDto)
  @ApiProperty({
    description: 'Array of shoe requests',
    required: false,
    type: [CreateShoeRequestWithoutEventDto],
  })
  products?: CreateShoeRequestWithoutEventDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaggedProductDto)
  @ApiProperty({
    description: 'Array of tagged products with prices',
    required: false,
    type: [TaggedProductDto],
  })
  tagged_products?: TaggedProductDto[];

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Sales before VAT amount', required: false })
  sales_before_vat?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Business type', required: false })
  business_type?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Shoe order quantity', required: false })
  shoe_order_quantity?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Has appointment', required: false })
  has_appointment?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Purchase months',
    required: false,
    type: [String],
  })
  purchase_months?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Test result', required: false })
  test_result?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Test result reason', required: false })
  test_result_reason?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Got job status', required: false })
  got_job?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Got job reason', required: false })
  got_job_reason?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Problem type', required: false })
  problem_type?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Present time (HH:mm)', required: false })
  present_time?: string;
}
