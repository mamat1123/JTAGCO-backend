import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../shared/services/supabase.service';
import { CreateShoeRequestDto } from './dto/create-shoe-request.dto';
import { ShoeRequestDto, ShoeRequestStatus } from './dto/shoe-request.dto';
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
  ): Promise<{ data: any[]; total: number }> {
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
        pickup_date,
        reason,
        created_at,
        event_id,
        variant_id,
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
        ),
        shoe_returns:shoe_returns_shoe_request_id_fkey (
          id,
          quantity,
          returned_at,
          reason,
          returned_by,
          returners:returned_by (
            fullname
          )
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
        const safeTerm = query.searchTerm.replace(/[%_]/g, '\\$&'); // prevent wildcard injection
        queryBuilder = queryBuilder.or(`
          events.description.ilike.%${safeTerm}%,
          product_variants.products.name.ilike.%${safeTerm}%,
          requesters.fullname.ilike.%${safeTerm}%
        `);
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

    // === Batch fetch event_shoe_variants ===
    const uniqueKeys = Array.from(
      new Set(shoeRequests.map(r => `${r.event_id}__${r.variant_id}`))
    ).map(key => {
      const [event_id, shoe_variant_id] = key.split('__');
      return { event_id, shoe_variant_id };
    });

    let eventShoeVariants: any[] = [];
    console.log("uniqueKeys", uniqueKeys)
    if (uniqueKeys.length > 0) {
      const { data, error: variantError } = await client
        .from('event_shoe_variants')
        .select('id, event_id, shoe_variant_id')
        .in('event_id', uniqueKeys.map(k => k.event_id))
        .in('shoe_variant_id', uniqueKeys.map(k => k.shoe_variant_id));

      if (variantError) {
        console.error('Supabase error:', variantError);
        throw new Error('Failed to fetch event_shoe_variants');
      }
      eventShoeVariants = data || [];
    }

    console.log("eventShoeVariants", eventShoeVariants)

    const eventShoeVariantMap: Record<string, string> = {};
    for (const ev of eventShoeVariants) {
      const key = `${ev.event_id}__${ev.shoe_variant_id}`;
      eventShoeVariantMap[key] = ev.id;
    }

    // === Grouping by event_id ===
    const groupedData = Object.values(
      shoeRequests.reduce((acc, curr) => {
        const eventId = curr.event_id;
        const key = `${curr.event_id}__${curr.variant_id}`;

        if (!acc[eventId]) {
          acc[eventId] = {
            event_id: eventId,
            event: curr.events,
            products: [],
            created_at: curr.created_at,
          };
        }

        const returnedQuantity = curr.shoe_returns?.reduce((sum, ret) => sum + ret.quantity, 0) || 0;
        const isFullyReturned = returnedQuantity >= curr.quantity;

        // Transform shoe_returns to include returner names
        const transformedReturns = curr.shoe_returns?.map(ret => ({
          ...ret,
          returner_name: (ret.returners as any)?.fullname || 'Unknown',
          returners: undefined, // Remove the nested object
        })) || [];

        acc[eventId].products.push({
          id: curr.id,
          event_shoe_variant_id: eventShoeVariantMap[key] || null,
          quantity: curr.quantity,
          status: isFullyReturned ? ShoeRequestStatus.RETURNED : curr.status,
          return_date: curr.return_date,
          pickup_date: curr.pickup_date,
          reason: curr.reason,
          product_variant: curr.product_variants,
          requester: curr.requesters,
          approver: curr.approvers,
          returned_quantity: returnedQuantity,
          is_fully_returned: isFullyReturned,
          returns: transformedReturns,
        });

        return acc;
      }, {})
    );

    return {
      data: groupedData,
      total: count || 0,
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