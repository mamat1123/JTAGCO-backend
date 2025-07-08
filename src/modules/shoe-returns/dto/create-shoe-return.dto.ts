import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateShoeReturnDto {
  @IsUUID()
  @IsNotEmpty()
  event_shoe_variant_id: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsString()
  reason?: string;
} 