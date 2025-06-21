import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { EventStatus } from '../entities/event.entity';
import { Type } from 'class-transformer';
import { CreateShoeRequestDto } from '../../shoe-requests/dto/create-shoe-request.dto';
import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShoeRequestWithoutEventDto extends OmitType(CreateShoeRequestDto, ['event_id'] as const) { }

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
  @ApiProperty({ description: 'Event status', enum: EventStatus, required: false })
  status?: EventStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Customer ID', required: false })
  customer_id?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Array of image URLs', required: false, type: [String] })
  image_urls?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShoeRequestWithoutEventDto)
  @ApiProperty({ description: 'Array of shoe requests', required: false, type: [CreateShoeRequestWithoutEventDto] })
  products?: (CreateShoeRequestWithoutEventDto)[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @ApiProperty({ description: 'Array of product IDs to tag with this event', required: false, type: [String] })
  tagged_products?: string[];
} 