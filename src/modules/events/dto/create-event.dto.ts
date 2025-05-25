import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { EventStatus } from '../entities/event.entity';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  companyId: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  mainTypeId: number;

  @IsNotEmpty()
  @IsInt()
  subTypeId: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDate()
  scheduledAt: Date;

  @IsOptional()
  @IsDate()
  testStartAt?: Date;

  @IsOptional()
  @IsDate()
  testEndAt?: Date;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
} 