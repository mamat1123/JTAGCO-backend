import { IsDate, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShoeRequestDto {
  @IsUUID()
  @IsNotEmpty()
  event_id: string;

  @IsUUID()
  @IsNotEmpty()
  variant_id: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  return_date?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  pickup_date?: Date;
} 