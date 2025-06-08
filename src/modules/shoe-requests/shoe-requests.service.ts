import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../shared/services/supabase.service';
import { CreateShoeRequestDto } from './dto/create-shoe-request.dto';
import { ShoeRequestDto } from './dto/shoe-request.dto';
import { ShoeRequestStatus } from './dto/shoe-request.dto';
import { FindAllShoeRequestDto } from './dto/find-all-shoe-request.dto';

@Injectable()
export class ShoeRequestsService {
  constructor(
    private readonly supabaseService: SupabaseService,
  ) { }

  async create(userId: string, createShoeRequestDto: CreateShoeRequestDto, token: string): Promise<ShoeRequestDto> {
    const client = await this.supabaseService.getUserClient(token);

    const { data: shoeRequest, error } = await client
      .from('shoe_requests')
      .insert({
        ...createShoeRequestDto,
        requested_by: userId,
        status: ShoeRequestStatus.PENDING,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to create shoe request');
    }

    return this.transformShoeRequestData(shoeRequest);
  }

  async findAll(
    token: string,
    eventId?: string,
    query?: FindAllShoeRequestDto,
  ): Promise<{ data: ShoeRequestDto[], total: number }> {
    const client = await this.supabaseService.getUserClient(token);
    const { page = 1, limit = 10 } = query || {};
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let queryBuilder = client
      .from('shoe_requests')
      .select(`
        id,
        quantity,
        status,
        return_date,
        reason,
        created_at,
        events:event_id (
          description,
          scheduled_at,
          event_main_types:main_type_id (
            name
          ),
          event_sub_types:sub_type_id (
            name
          )
        ),
        product_variants:variant_id (
          attributes,
          products:product_id (
            type,
            name
          )
        ),
        requesters:requested_by (
          fullname
        ),
        approvers:approved_by (
          fullname
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (eventId) {
      queryBuilder = queryBuilder.eq('event_id', eventId);
    }

    if (query) {
      if (query.status) {
        queryBuilder = queryBuilder.eq('status', query.status);
      }

      if (query.searchTerm) {
        queryBuilder = queryBuilder.or(`events.description.ilike.%${query.searchTerm}%,product_variants.products.name.ilike.%${query.searchTerm}%,requesters.fullname.ilike.%${query.searchTerm}%`);
      }

      if (query.productName) {
        queryBuilder = queryBuilder.ilike('product_variants.products.name', `%${query.productName}%`);
      }

      if (query.requesterName) {
        queryBuilder = queryBuilder.ilike('requesters.fullname', `%${query.requesterName}%`);
      }
    }

    const { data: shoeRequests, error, count } = await queryBuilder.range(start, end);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to fetch shoe requests');
    }

    return {
      data: shoeRequests.map(request => this.transformShoeRequestData(request)),
      total: count || 0
    };
  }

  async findOne(id: string, token: string): Promise<ShoeRequestDto> {
    const client = await this.supabaseService.getUserClient(token);
    const { data: shoeRequest, error } = await client
      .from('shoe_requests')
      .select(`
        *,
        events:event_id (description),
        product_variants:shoe_variant_id (
          id,
          sku,
          attributes,
          price,
          stock,
          products:product_id (
            id,
            name
          )
        ),
        requesters:requested_by (fullname),
        approvers:approved_by (fullname)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new NotFoundException(`Shoe request with ID ${id} not found`);
    }

    return this.transformShoeRequestData(shoeRequest);
  }

  async updateStatus(
    id: string,
    status: ShoeRequestStatus,
    approverId: string,
    token: string,
    reason?: string,
  ): Promise<ShoeRequestDto> {
    const client = await this.supabaseService.getUserClient(token);
    const { data: shoeRequest, error } = await client
      .from('shoe_requests')
      .update({
        status,
        approved_by: approverId,
        approved_at: new Date().toISOString(),
        reason,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new NotFoundException(`Shoe request with ID ${id} not found`);
    }

    if (status === ShoeRequestStatus.APPROVED) {

      const { error: insertError } = await client
        .from('event_shoe_variants')
        .insert({
          event_id: shoeRequest.event_id,
          shoe_variant_id: shoeRequest.variant_id,
          quantity: shoeRequest.quantity,
        });

      if (insertError) {
        console.error('Supabase error:', insertError);
        throw new Error('Failed to create event shoe variant record');
      }
    }

    return this.transformShoeRequestData(shoeRequest);
  }

  async createMany(userId: string, shoeRequests: CreateShoeRequestDto[], token: string): Promise<ShoeRequestDto[]> {
    const client = await this.supabaseService.getUserClient(token);
    const { data, error } = await client
      .from('shoe_requests')
      .insert(shoeRequests.map(request => ({
        ...request,
        requested_by: userId,
        status: ShoeRequestStatus.PENDING,
      })))
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to create shoe requests');
    }

    return data.map(request => this.transformShoeRequestData(request));
  }

  private transformShoeRequestData(shoeRequest: any): ShoeRequestDto {
    return {
      ...shoeRequest,
      eventDescription: shoeRequest.events?.description,
      scheduledAt: shoeRequest.events?.scheduled_at,
      mainTypeName: shoeRequest.events?.event_main_types?.name,
      subTypeName: shoeRequest.events?.event_sub_types?.name,
      productType: shoeRequest.product_variants?.products?.type,
      productName: shoeRequest.product_variants?.products?.name,
      attributes: shoeRequest.product_variants?.attributes,
      requesterName: shoeRequest.requesters?.fullname,
      approverName: shoeRequest.approvers?.fullname,
      events: undefined,
      product_variants: undefined,
      requesters: undefined,
      approvers: undefined,
    };
  }
} 