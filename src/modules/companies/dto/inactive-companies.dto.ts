import { IsOptional, IsNumber, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class InactiveCompaniesDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  months?: number = 3;

  @IsOptional()
  @IsString()
  sortBy?: 'last_event_updated_at' | 'credit' | 'total_employees';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
} 