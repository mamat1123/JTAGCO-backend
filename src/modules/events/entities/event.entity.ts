import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum EventStatus {
  PLANNED = 'planned',
  COMPLETED = 'completed',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id', type: 'text' })
  companyId: string;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'main_type_id', type: 'int' })
  mainTypeId: number;

  @Column({ name: 'sub_type_id', type: 'int' })
  subTypeId: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'scheduled_at', type: 'date' })
  scheduledAt: Date;

  @Column({ name: 'test_start_at', type: 'date', nullable: true })
  testStartAt: Date;

  @Column({ name: 'test_end_at', type: 'date', nullable: true })
  testEndAt: Date;

  @Column({
    type: 'text',
    default: EventStatus.PLANNED,
    enum: EventStatus,
  })
  status: EventStatus;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Joined fields
  companyName?: string;
  userFullName?: string;
  subTypeName?: string;
  eventImages?: string[];
  eventCheckins?: string[];
} 