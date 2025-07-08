import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../shared/services/supabase.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { QueryEventDto } from './dto/query-event.dto';
import { formatDateForDatabase } from '../../shared/utils/date.util';
import { ShoeRequestsService } from '../shoe-requests/shoe-requests.service';
import { Step, StepStatus, ShoeRequestWithProductVariantDto } from './dto/event-request-timeline.dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly shoeRequestsService: ShoeRequestsService,
  ) { }

  async create(userId: string, createEventDto: CreateEventDto, token: string): Promise<Event> {
    const client = await this.supabaseService.getUserClient(token);

    // Start a transaction
    const { data: event, error: eventError } = await client
      .from('events')
      .insert({
        description: createEventDto.description,
        scheduled_at: formatDateForDatabase(createEventDto.scheduled_at),
        test_start_at: createEventDto.test_start_at ? formatDateForDatabase(createEventDto.test_start_at) : null,
        test_end_at: createEventDto.test_end_at ? formatDateForDatabase(createEventDto.test_end_at) : null,
        main_type_id: createEventDto.main_type_id,
        sub_type_id: createEventDto.sub_type_id || null,
        company_id: createEventDto.company_id,
        customer_id: createEventDto.customer_id,
        user_id: userId,
      })
      .select()
      .single();

    if (eventError) {
      console.error('Supabase error:', eventError);
      throw new Error('Failed to create event');
    }

    // Insert event shoe variants if products exist
    if (createEventDto.products && createEventDto.products.length > 0) {
      const shoeRequests = createEventDto.products.map(product => ({
        event_id: event.id,
        variant_id: product.variant_id,
        quantity: product.quantity,
        return_date: product.return_date || undefined,
        pickup_date: product.pickup_date || undefined,
      }));

      await this.shoeRequestsService.createMany(userId, shoeRequests, token);
    }

    // Insert event images if image_urls exist
    if (createEventDto.image_urls && createEventDto.image_urls.length > 0) {
      const eventImages = createEventDto.image_urls.map(url => ({
        event_id: event.id,
        url,
        type: 'plan',
      }));

      const { error: imagesError } = await client
        .from('event_images')
        .insert(eventImages);

      if (imagesError) {
        console.error('Supabase error:', imagesError);
        throw new Error('Failed to create event images');
      }
    }

    // Insert event product tags if tagged_products exist
    if (createEventDto.tagged_products && createEventDto.tagged_products.length > 0) {
      const eventProductTags = createEventDto.tagged_products.map(taggedProduct => ({
        event_id: event.id,
        product_id: taggedProduct.product_id,
        price: taggedProduct.price,
      }));

      const { error: tagsError } = await client
        .from('event_product_tags')
        .insert(eventProductTags);

      if (tagsError) {
        console.error('Supabase error:', tagsError);
        throw new Error('Failed to create event product tags');
      }
    }

    // Fetch the complete event with all relations
    const { data: completeEvent, error: fetchError } = await client
      .from('events')
      .select(`
        *,
        companies:company_id (name),
        profiles:user_id (fullname),
        event_images!event_images_event_id_fkey (url),
        event_shoe_variants!event_shoe_variants_event_id_fkey (
          quantity,
          shoe_variants:shoe_variant_id (
            id,
            sku,
            attributes,
            price,
            stock,
            products:product_id (
              id,
              name
            )
          )
        ),
        event_product_tags!event_product_tags_event_id_fkey (
          product_id,
          price,
          products:product_id (
            id,
            name
          )
        )
      `)
      .eq('id', event.id)
      .single();

    if (fetchError) {
      console.error('Supabase error:', fetchError);
      throw new Error('Failed to fetch created event');
    }

    return this.transformEventData(completeEvent);
  }

  async findAll(token: string, query: QueryEventDto): Promise<Event[]> {
    const client = await this.supabaseService.getUserClient(token);
    let queryBuilder = client
      .from('events')
      .select(`
        *,
        companies:company_id (name),
        profiles:user_id (fullname),
        sub_types:sub_type_id (name),
        main_types:main_type_id (name),
        event_product_tags!event_product_tags_event_id_fkey (
          product_id,
          price,
          products:product_id (
            id,
            name
          )
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (query.company_id) {
      queryBuilder = queryBuilder.eq('company_id', query.company_id);
    }

    if (query.status) {
      queryBuilder = queryBuilder.eq('status', query.status);
    }

    if (query.scheduled_at_start) {
      queryBuilder = queryBuilder.gte('scheduled_at', query.scheduled_at_start.toISOString().split('T')[0]);
    }

    if (query.scheduled_at_end) {
      queryBuilder = queryBuilder.lte('scheduled_at', query.scheduled_at_end.toISOString().split('T')[0]);
    }

    if (query.main_type_id) {
      queryBuilder = queryBuilder.eq('main_type_id', query.main_type_id);
    }

    if (query.sub_type_id) {
      queryBuilder = queryBuilder.eq('sub_type_id', query.sub_type_id);
    }

    if (query.user_id) {
      queryBuilder = queryBuilder.eq('user_id', query.user_id);
    }

    // Filter by tagged_product_id if provided
    if (query.tagged_product_id) {
      // Get event IDs that have the specified tagged product
      const { data: eventIds, error: eventIdsError } = await client
        .from('event_product_tags')
        .select('event_id')
        .eq('product_id', query.tagged_product_id);

      if (eventIdsError) {
        console.error('Supabase error:', eventIdsError);
        throw new Error('Failed to fetch events with tagged product');
      }

      if (eventIds.length === 0) {
        // No events found with this tagged product, return empty array
        return [];
      }

      const eventIdList = eventIds.map(item => item.event_id);
      queryBuilder = queryBuilder.in('id', eventIdList);
    }

    const { data: events, error } = await queryBuilder;

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to fetch events');
    }
    let filtered = events;

    if (query.search) {
      const keyword = query.search.toLowerCase();
      filtered = events.filter(e =>
        e.company_id?.toString().includes(keyword) ||
        e.description?.toLowerCase().includes(keyword) ||
        e.companies?.name?.toLowerCase().includes(keyword)
      );
    }

    return filtered.map(event => this.transformEventData(event));
  }

  async findOne(userId: string, id: string, token: string): Promise<Event> {
    const client = await this.supabaseService.getUserClient(token);
    const { data: event, error } = await client
      .from('events')
      .select(`
        *,
        companies:company_id (name),
        customers:customer_id (contact_name, phone, email),
        profiles:user_id (fullname),
        sub_types:sub_type_id (name),
        main_types:main_type_id (name),
        event_images!event_images_event_id_fkey (url),
        event_checkins!event_checkins_event_id_fkey (detail, created_at),
        event_product_tags!event_product_tags_event_id_fkey (
          product_id,
          price,
          products:product_id (
            id,
            name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return this.transformEventData(event);
  }

  async update(userId: string, id: string, updateEventDto: UpdateEventDto, token: string): Promise<Event> {
    const client = await this.supabaseService.getUserClient(token);
    
    // Extract tagged_products from updateEventDto to handle separately
    const { tagged_products, ...eventUpdateData } = updateEventDto;
    
    const { data: event, error } = await client
      .from('events')
      .update(eventUpdateData)
      .eq('id', id)
      .select(`
        *,
        companies:company_id (name),
        profiles:id (fullname)
      `)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Handle tagged products update
    if (tagged_products !== undefined) {
      // Delete existing tags
      const { error: deleteError } = await client
        .from('event_product_tags')
        .delete()
        .eq('event_id', id);

      if (deleteError) {
        console.error('Supabase error:', deleteError);
        throw new Error('Failed to delete existing event product tags');
      }

      // Insert new tags if provided
      if (tagged_products && tagged_products.length > 0) {
        const eventProductTags = tagged_products.map(taggedProduct => ({
          event_id: id,
          product_id: taggedProduct.product_id,
          price: taggedProduct.price,
        }));

        const { error: insertError } = await client
          .from('event_product_tags')
          .insert(eventProductTags);

        if (insertError) {
          console.error('Supabase error:', insertError);
          throw new Error('Failed to create event product tags');
        }
      }
    }

    // Fetch the complete updated event with all relations
    const { data: completeEvent, error: fetchError } = await client
      .from('events')
      .select(`
        *,
        companies:company_id (name),
        customers:customer_id (contact_name, phone, email),
        profiles:user_id (fullname),
        sub_types:sub_type_id (name),
        main_types:main_type_id (name),
        event_images!event_images_event_id_fkey (url),
        event_checkins!event_checkins_event_id_fkey (detail, created_at),
        event_product_tags!event_product_tags_event_id_fkey (
          product_id,
          price,
          products:product_id (
            id,
            name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Supabase error:', fetchError);
      throw new Error('Failed to fetch updated event');
    }

    return this.transformEventData(completeEvent);
  }

  async remove(userId: string, id: string, token: string): Promise<void> {
    const client = await this.supabaseService.getUserClient(token);
    const { error } = await client
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to delete event');
    }
  }

  async getEventRequestTimeline(eventId: string, token: string): Promise<Step[]> {
    const client = await this.supabaseService.getUserClient(token);

    // Get shoe requests with product variant information
    const { data: shoeRequests, error: shoeRequestsError } = await client
      .from('shoe_requests')
      .select(`
        *,
        product_variants:variant_id (
          id,
          sku,
          attributes,
          price,
          stock,
          products:product_id (
            id,
            name
          )
        )
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: true }) as { data: ShoeRequestWithProductVariantDto[] | null; error: any };

    if (shoeRequestsError) {
      console.error('Supabase error:', shoeRequestsError);
      throw new Error('Failed to fetch shoe requests');
    }

    if (!shoeRequests || shoeRequests.length === 0) {
      return []
    }

    // Get event shoe variants
    const { data: variants, error: variantsError } = await client
      .from('event_shoe_variants')
      .select('*')
      .eq('event_id', eventId);

    if (variantsError) {
      console.error('Supabase error:', variantsError);
      throw new Error('Failed to fetch event shoe variants');
    }

    const variantIds = variants.map(v => v.id);

    // Get shoe returns
    const { data: returns, error: returnsError } = await client
      .from('shoe_returns')
      .select('*')
      .in('event_shoe_variant_id', variantIds.length > 0 ? variantIds : ['']);

    if (returnsError) {
      console.error('Supabase error:', returnsError);
      throw new Error('Failed to fetch shoe returns');
    }

    const firstRequest = shoeRequests[0];
    const allApproved = shoeRequests.every(r => r.status !== 'pending');
    const anyApproved = shoeRequests.some(r => r.status === 'approved');
    const received = variants.some(v => v.status === 'received');
    const latestReturn = returns.sort((a, b) =>
      new Date(b.returned_at).getTime() - new Date(a.returned_at).getTime()
    )[0];

    const steps: Step[] = [
      {
        id: 1,
        title: 'เริ่มต้น',
        description: 'ขอเบิกสินค้า',
        date: firstRequest.created_at?.toString() || '',
        status: StepStatus.COMPLETED,
      },
      {
        id: 2,
        title: 'อนุมัติ',
        description: 'สินค้าได้รับการอนุมัติจากผู้จัดการ',
        date: allApproved
          ? shoeRequests
            .filter(r => r.status === 'approved')
            .sort((a, b) => new Date(b.approved_at || 0).getTime() - new Date(a.approved_at || 0).getTime())[0]?.approved_at?.toString() || ''
          : '',
        status: allApproved ? StepStatus.COMPLETED : StepStatus.PENDING,
        data: shoeRequests
      },
      {
        id: 3,
        title: 'ได้รับสินค้า',
        description: 'ได้รับสินค้าจากผู้จัดการ',
        date: received ? variants.find(v => v.status === 'received')?.updated_at?.toString() || '' : '',
        status: received ? StepStatus.COMPLETED : (allApproved ? StepStatus.CURRENT : StepStatus.PENDING),
      },
      {
        id: 4,
        title: 'ส่งคืนสินค้า',
        description: 'ส่งคืนสินค้าให้กับผู้จัดการ',
        date: latestReturn ? latestReturn.returned_at?.toString() || '' : '',
        status: latestReturn ? StepStatus.COMPLETED : (received ? StepStatus.CURRENT : StepStatus.PENDING),
      },
    ];

    return steps;
  }

  async updateEventShoeVariantsToReceive(eventId: string, token: string): Promise<void> {
    const client = await this.supabaseService.getUserClient(token);

    // Update all event shoe variants for the given event to 'received' status
    const { error } = await client
      .from('event_shoe_variants')
      .update({ status: 'received', updated_at: new Date().toISOString() })
      .eq('event_id', eventId);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to update event shoe variants status');
    }
  }

  private transformEventData(event: any): Event {
    return {
      ...event,
      companyName: event.companies?.name,
      userFullName: event.profiles?.fullname,
      subTypeName: event.sub_types?.name,
      mainTypeName: event.main_types?.name,
      eventImages: event.event_images?.map((image: { url: string }) => image.url),
      eventCheckins: event.event_checkins?.map((checkin: { detail: string, created_at: string }) => ({
        detail: checkin.detail,
        created_at: checkin.created_at
      })),
      taggedProducts: event.event_product_tags?.map((tag: { product_id: string, price: number, products: { id: string, name: string } }) => ({
        id: tag.product_id,
        name: tag.products.name,
        price: tag.price
      })),
      companies: undefined,
      profiles: undefined,
      sub_types: undefined,
      event_images: undefined,
      event_checkins: undefined,
      main_types: undefined,
      event_product_tags: undefined,
    };
  }
} 