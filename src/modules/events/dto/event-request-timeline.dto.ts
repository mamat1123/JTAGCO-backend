import { ApiProperty } from '@nestjs/swagger';

export enum StepStatus {
  COMPLETED = 'completed',
  CURRENT = 'current',
  PENDING = 'pending',
}

export class Step {
  @ApiProperty({ description: 'Step ID' })
  id: number;

  @ApiProperty({ description: 'Step title' })
  title: string;

  @ApiProperty({ description: 'Step description' })
  description: string;

  @ApiProperty({ description: 'Step date in format dd MMM yyyy' })
  date: string;

  @ApiProperty({ description: 'Step status', enum: StepStatus })
  status: StepStatus;
} 