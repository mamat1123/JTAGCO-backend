import { ApiProperty } from '@nestjs/swagger';

export class ProductSelectionDto {
  @ApiProperty({ description: 'Product ID' })
  product_id: string;

  @ApiProperty({ description: 'Product name' })
  name: string;

  @ApiProperty({ description: 'Product price' })
  price: number;

  @ApiProperty({ description: 'Price range' })
  price_range: string;
}

export class EventCheckinDto {
  @ApiProperty({ description: 'Unique identifier of the check-in' })
  id: string;

  @ApiProperty({ description: 'Event ID associated with the check-in' })
  eventId: string;

  @ApiProperty({ description: 'Timestamp when the check-in occurred' })
  checkin_at: Date;

  @ApiProperty({
    description: 'Additional details about the check-in',
    required: false,
  })
  detail?: string;

  @ApiProperty({
    description: 'Array of image URLs',
    type: [String],
    required: false,
  })
  images?: string[];

  @ApiProperty({
    description: 'Product selections for PRESENT check-in',
    type: [ProductSelectionDto],
    required: false,
  })
  product_selections?: ProductSelectionDto[];

  @ApiProperty({ description: 'Delivery duration', required: false })
  delivery_duration?: string;

  @ApiProperty({
    description: 'Purchase type (monthly/yearly)',
    required: false,
  })
  purchase_type?: string;

  @ApiProperty({
    description: 'Purchase months',
    type: [String],
    required: false,
  })
  purchase_months?: string[];

  @ApiProperty({ description: 'Competitor brand', required: false })
  competitor_brand?: string;

  @ApiProperty({ description: 'Special requirements', required: false })
  special_requirements?: string;

  @ApiProperty({ description: 'Test result (pass/fail)', required: false })
  test_result?: string;

  @ApiProperty({ description: 'Reason for test failure', required: false })
  test_result_reason?: string;

  @ApiProperty({ description: 'Got job (yes/no)', required: false })
  got_job?: string;

  @ApiProperty({ description: 'Reason for not getting job', required: false })
  got_job_reason?: string;

  @ApiProperty({
    description: 'Problem types for FOUND_PROBLEM check-in',
    type: [String],
    required: false,
  })
  problem_types?: string[];

  @ApiProperty({ description: 'Timestamp when record was created' })
  created_at: Date;
}
