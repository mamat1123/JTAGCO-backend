import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum EventStatus {
  PLANNED = 'planned',
  COMPLETED = 'completed',
}

interface EventImage {
  url: string;
  type: string;
}

interface ShoeVariant {
  id: string;
  sku: string;
  attributes: {
    size?: string;
    color?: string;
    image?: string;
    steel_plate?: string;
  };
  price: number;
  stock: number;
  products: {
    id: string;
    name: string;
  };
}

interface EventShoeVariant {
  quantity: number;
  shoe_variants: ShoeVariant;
}

interface TaggedProduct {
  id: string;
  name: string;
  price: number;
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

  @Column({ name: 'sales_before_vat', type: 'int', nullable: true })
  salesBeforeVat: number;

  @Column({ name: 'business_type', type: 'varchar', length: 255, nullable: true })
  businessType: string;

  @Column({ name: 'shoe_order_quantity', type: 'int', nullable: true })
  shoeOrderQuantity: number;

  @Column({ name: 'has_appointment', type: 'boolean', nullable: true })
  hasAppointment: boolean;

  @Column({ name: 'purchase_months', type: 'text', array: true, nullable: true })
  purchaseMonths: string[];

  @Column({ name: 'test_result', type: 'varchar', length: 50, nullable: true })
  testResult: string;

  @Column({ name: 'test_result_reason', type: 'text', nullable: true })
  testResultReason: string;

  @Column({ name: 'got_job', type: 'varchar', length: 50, nullable: true })
  gotJob: string;

  @Column({ name: 'got_job_reason', type: 'text', nullable: true })
  gotJobReason: string;

  @Column({ name: 'problem_type', type: 'varchar', length: 100, nullable: true })
  problemType: string;

  @Column({ name: 'present_time', type: 'time', nullable: true })
  presentTime: string;

  // Joined fields
  companyName?: string;
  userFullName?: string;
  subTypeName?: string;
  mainTypeName?: string;
  eventImages?: EventImage[];
  eventShoeVariants?: EventShoeVariant[];
  taggedProducts?: TaggedProduct[];
} 