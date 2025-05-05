import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'contact_id', nullable: true })
  contact_id: string;

  @Column({ name: 'company_id', nullable: true })
  company_id: string;

  @Column({ name: 'contact_name' })
  contact_name: string;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'line_id', nullable: true })
  line_id: string;

  @Column({ name: 'image_url', nullable: true })
  image_url: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
} 