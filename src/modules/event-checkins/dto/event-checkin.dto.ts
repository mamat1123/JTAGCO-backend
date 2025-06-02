import { ApiProperty } from '@nestjs/swagger';

export class EventCheckinDto {
  @ApiProperty({ description: 'Unique identifier of the check-in' })
  id: string;

  @ApiProperty({ description: 'Event ID associated with the check-in' })
  eventId: string;

  @ApiProperty({ description: 'Timestamp when the check-in occurred' })
  checkin_at: Date;

  @ApiProperty({ description: 'Additional details about the check-in', required: false })
  detail?: string;

  @ApiProperty({ description: 'Timestamp when the record was created' })
  created_at: Date;
} 