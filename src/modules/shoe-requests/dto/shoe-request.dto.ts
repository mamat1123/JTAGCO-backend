import { IsDate, IsEnum, IsInt, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export enum ShoeRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  RETURNED = 'returned',
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
  return_date?: Date;

  @IsOptional()
  @IsDate()
  pickup_date?: Date;

  // Additional transformed fields
  eventDescription?: string;
  scheduledAt?: Date;
  mainTypeName?: string;
  subTypeName?: string;
  productType?: string;
  productName?: string;
  attributes?: any;
  requesterName?: string;
  approverName?: string;
} 