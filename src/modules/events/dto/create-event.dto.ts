import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { EventStatus } from '../entities/event.entity';
import { Type } from 'class-transformer';
import { CreateShoeRequestDto } from '../../shoe-requests/dto/create-shoe-request.dto';
import { OmitType } from '@nestjs/mapped-types';

export class CreateShoeRequestWithoutEventDto extends OmitType(CreateShoeRequestDto, ['event_id'] as const) { }

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  company_id: string;

  @IsNotEmpty()
  @IsString()
  main_type_id: string;

  @IsOptional()
  @IsString()
  sub_type_id?: string;

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
  @Type(() => CreateShoeRequestWithoutEventDto)
  products?: (CreateShoeRequestWithoutEventDto)[];
} 