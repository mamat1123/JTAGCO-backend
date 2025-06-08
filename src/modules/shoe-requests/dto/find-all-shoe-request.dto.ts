import { IsOptional, IsString, IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllShoeRequestDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  searchTerm?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  requesterName?: string;

  @IsOptional()
  @IsUUID()
  eventId?: string;
} 