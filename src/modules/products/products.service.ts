import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../shared/services/supabase.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly supabaseService: SupabaseService,
  ) {}

  async create(createProductDto: CreateProductDto, token: string): Promise<Product> {
    const client = await this.supabaseService.getUserClient(token);
    const { data: product, error } = await client
      .from('products')
      .insert(createProductDto)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to create product');
    }

    return product;
  }

  async findAll(token: string): Promise<Product[]> {
    const client = await this.supabaseService.getUserClient(token);
    const { data: products, error } = await client
      .from('products')
      .select('*')
      .order('priority', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to fetch products');
    }

    return products;
  }

  async findOne(id: string, token: string): Promise<Product> {
    const client = await this.supabaseService.getUserClient(token);
    const { data: product, error } = await client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, token: string): Promise<Product> {
    const client = await this.supabaseService.getUserClient(token);
    const { data: product, error } = await client
      .from('products')
      .update(updateProductDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async remove(id: string, token: string): Promise<void> {
    const client = await this.supabaseService.getUserClient(token);
    const { error } = await client
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to delete product');
    }
  }
} 