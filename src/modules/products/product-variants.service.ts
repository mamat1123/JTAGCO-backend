import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../shared/services/supabase.service';
import { ProductVariant } from './entities/product-variant.entity';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { transformVariantToCombinations } from './utils/variant-transformer.util';

@Injectable()
export class ProductVariantsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(
    createProductVariantDto: CreateProductVariantDto,
    token: string,
  ): Promise<ProductVariant> {
    const client = await this.supabaseService.getUserClient(token);
    const { data: variant, error } = await client
      .from('product_variants')
      .insert(createProductVariantDto)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to create product variant');
    }

    return variant;
  }

  async createMultipleVariants(
    input: any,
    token: string,
  ): Promise<ProductVariant[]> {
    const variants = transformVariantToCombinations(input);
    const client = await this.supabaseService.getUserClient(token);

    const { data, error } = await client
      .from('product_variants')
      .insert(variants)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to create product variants');
    }

    return data;
  }

  async findAll(token: string): Promise<ProductVariant[]> {
    const client = await this.supabaseService.getUserClient(token);
    const { data: variants, error } = await client
      .from('product_variants')
      .select(
        `
        *,
        product:products(*)
      `,
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to fetch product variants');
    }

    return variants;
  }

  async findByProductId(
    productId: string,
    token: string,
  ): Promise<ProductVariant[]> {
    const client = await this.supabaseService.getUserClient(token);
    const { data: variants, error } = await client
      .from('product_variants')
      .select(
        `
        *,
        product:products(*)
      `,
      )
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to fetch product variants');
    }

    return variants;
  }

  async findOne(id: string, token: string): Promise<ProductVariant> {
    const client = await this.supabaseService.getUserClient(token);
    const { data: variant, error } = await client
      .from('product_variants')
      .select(
        `
        *,
        product:products(*)
      `,
      )
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new NotFoundException(`Product variant with ID ${id} not found`);
    }

    return variant;
  }

  async update(
    id: string,
    updateProductVariantDto: UpdateProductVariantDto,
    token: string,
  ): Promise<ProductVariant> {
    const client = await this.supabaseService.getUserClient(token);
    const { data: variant, error } = await client
      .from('product_variants')
      .update(updateProductVariantDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new NotFoundException(`Product variant with ID ${id} not found`);
    }

    return variant;
  }

  async remove(id: string, token: string): Promise<void> {
    const client = await this.supabaseService.getUserClient(token);
    const { error } = await client
      .from('product_variants')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to delete product variant');
    }
  }
}
