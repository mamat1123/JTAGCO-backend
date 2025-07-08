import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../shared/services/supabase.service';
import { CreateShoeReturnDto } from './dto/create-shoe-return.dto';
import { ShoeReturnDto } from './dto/shoe-return.dto';
import { ReceiveShoeReturnDto } from './dto/receive-shoe-return.dto';

@Injectable()
export class ShoeReturnsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(
    returnedBy: string,
    createShoeReturnDto: CreateShoeReturnDto,
    token: string,
  ): Promise<ShoeReturnDto> {
    const client = await this.supabaseService.getUserClient(token);

    const { data, error } = await client
      .from('shoe_returns')
      .insert({
        event_shoe_variant_id: createShoeReturnDto.event_shoe_variant_id,
        quantity: createShoeReturnDto.quantity,
        returned_by: parseInt(returnedBy),
        reason: createShoeReturnDto.reason,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to create shoe return');
    }

    return data;
  }

  async findAll(token: string): Promise<ShoeReturnDto[]> {
    const client = await this.supabaseService.getUserClient(token);

    const { data, error } = await client
      .from('shoe_returns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to fetch shoe returns');
    }

    return data || [];
  }

  async findOne(id: string, token: string): Promise<ShoeReturnDto> {
    const client = await this.supabaseService.getUserClient(token);

    const { data, error } = await client
      .from('shoe_returns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to fetch shoe return');
    }

    if (!data) {
      throw new NotFoundException('Shoe return not found');
    }

    return data;
  }

  async receive(
    eventShoeVariantId: string,
    receiveShoeReturnDto: ReceiveShoeReturnDto,
    returnedBy: string,
    token: string,
  ): Promise<ShoeReturnDto> {
    const client = await this.supabaseService.getUserClient(token);

    // Create a new shoe return record
    const { data, error } = await client
      .from('shoe_returns')
      .insert({
        event_shoe_variant_id: eventShoeVariantId,
        shoe_request_id: receiveShoeReturnDto.shoeRequestId,
        quantity: receiveShoeReturnDto.quantity,
        returned_by: parseInt(returnedBy),
        reason: receiveShoeReturnDto.comment,
        returned_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to create shoe return');
    }

    return data;
  }

  async findByEventShoeVariantId(
    eventShoeVariantId: string,
    token: string,
  ): Promise<ShoeReturnDto[]> {
    const client = await this.supabaseService.getUserClient(token);

    const { data, error } = await client
      .from('shoe_returns')
      .select('*')
      .eq('event_shoe_variant_id', eventShoeVariantId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to fetch shoe returns for event shoe variant');
    }

    return data || [];
  }
} 