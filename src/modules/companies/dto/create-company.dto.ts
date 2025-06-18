import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsNumber()
  business_type_id?: number;

  @IsOptional()
  @IsString()
  business_type_detail?: string;

  @IsOptional()
  @IsString()
  tax_id?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  sub_district?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsNumber()
  zip_code?: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  position?: any;

  @IsOptional()
  @IsString()
  previous_model?: string;

  @IsOptional()
  @IsString()
  issues_encountered_detail?: string;

  @IsOptional()
  @IsNumber()
  old_price?: number;

  @IsOptional()
  image?: any;

  @IsOptional()
  quotation_file?: any;

  @IsOptional()
  po_file?: any;

  @IsOptional()
  @IsString()
  competitor_details?: string;

  @IsOptional()
  @IsString()
  job_description?: string;

  @IsOptional()
  @IsNumber()
  total_employees?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value, 10);
    }
    return value;
  })
  @IsNumber()
  @Min(0)
  @Max(999)
  credit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  order_cycle?: number;

  @IsOptional()
  @IsString()
  detail?: string;

  @IsOptional()
  @IsString()
  issues_encountered_list?: string;
} 