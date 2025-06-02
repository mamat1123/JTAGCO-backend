import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum ProfileStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  WAIT_FOR_APPROVAL = 'wait_for_approval'
}

export class ApproveProfileDto {
  @ApiProperty({ 
    description: 'Profile status',
    enum: ProfileStatus,
    example: ProfileStatus.APPROVED
  })
  @IsEnum(ProfileStatus)
  status: ProfileStatus;
} 