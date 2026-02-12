import { ApiProperty } from '@nestjs/swagger';
import { ProfileStatus } from './approve-profile.dto';

export class ProfileDto {
  @ApiProperty({ description: 'Profile ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  user_id: string;

  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ description: 'Phone number' })
  phone: string;

  @ApiProperty({ description: 'User role' })
  role: string;

  @ApiProperty({ description: 'User email' })
  user_email: string;

  @ApiProperty({ description: 'Email' })
  email: string;

  @ApiProperty({ description: 'Full name' })
  fullname: string;

  @ApiProperty({
    description: 'Profile status',
    enum: ProfileStatus,
    example: ProfileStatus.WAIT_FOR_APPROVE,
  })
  status: ProfileStatus;
}
