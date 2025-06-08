import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export enum ShoeRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class ShoeRequestDto {
  @IsUUID()
  id: string;

  @IsUUID()
  event_id: string;

  @IsUUID()
  shoe_variant_id: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsEnum(ShoeRequestStatus)
  status: ShoeRequestStatus;

  @IsInt()
  requested_by: number;

  @IsOptional()
  @IsInt()
  approved_by?: number;

  @IsOptional()
  @IsDate()
  approved_at?: Date;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;

  @IsOptional()
  @IsDate()
  due_date?: Date;

  // Additional transformed fields
  eventDescription?: string;
  productVariant?: any;
  requesterName?: string;
  approverName?: string;
}

export class CreateShoeRequestDto {
  @IsUUID()
  @IsNotEmpty()
  event_id: string;

  @IsUUID()
  @IsNotEmpty()
  shoe_variant_id: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  due_date?: Date;
} 