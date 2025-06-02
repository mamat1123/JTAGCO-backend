import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventCheckinDto {
  @ApiProperty({ description: 'Additional details about the check-in', required: false })
  @IsOptional()
  @IsString()
  detail?: string;

  @ApiProperty({ description: 'Array of image URLs for the check-in', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  images: string[];
} 