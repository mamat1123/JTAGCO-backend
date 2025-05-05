import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class SearchCompanyDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;
} 