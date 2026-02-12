import { IsString, IsOptional, IsEmail, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCustomerDto {
  @IsString()
  @IsOptional()
  contact_id?: string;

  @IsString()
  company_id: string;

  @IsString()
  contact_name: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsEmail()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  line_id?: string;

  @IsUrl()
  @IsOptional()
  image_url?: string;
}
