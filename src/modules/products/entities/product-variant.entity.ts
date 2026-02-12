import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

export interface ProductVariantAttributes {
  colors?: Array<{
    color: string;
    image: string;
  }>;
  size?: string;
  steel_plate?: string;
  [key: string]: any;
}

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ unique: true, nullable: true })
  sku: string;

  @Column({ type: 'jsonb', nullable: true })
  attributes: ProductVariantAttributes;

  @Column({ type: 'boolean', default: false })
  isMadeToOrder: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  stock: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
