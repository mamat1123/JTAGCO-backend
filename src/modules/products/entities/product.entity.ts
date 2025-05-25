import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum ProductType {
  SHOE = 'shoe',
  INSOLE = 'insole',
  TOE_CAP = 'toe_cap',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ProductType,
    nullable: false,
  })
  type: ProductType;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;
} 