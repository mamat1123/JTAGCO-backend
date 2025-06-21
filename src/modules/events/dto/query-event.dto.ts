import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { EventStatus } from '../entities/event.entity';

export class QueryEventDto {
  @IsOptional()
  @IsString()
  company_id?: string;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduled_at_start?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduled_at_end?: Date;

  @IsOptional()
  @IsString()
  main_type_id?: string;

  @IsOptional()
  @IsString()
  sub_type_id?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsString()
  tagged_product_id?: string;
} 