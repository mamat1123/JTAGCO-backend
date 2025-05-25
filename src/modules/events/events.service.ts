import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../shared/services/supabase.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { QueryEventDto } from './dto/query-event.dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly supabaseService: SupabaseService,
  ) { }

  async create(userId: string, createEventDto: CreateEventDto, token: string): Promise<Event> {
    const client = await this.supabaseService.getUserClient(token);
    const { data: event, error } = await client
      .from('events')
      .insert(createEventDto)
      .select(`
        *,
        companies:company_id (name),
        profiles:id (fullname)
      `)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to create event');
    }

    return this.transformEventData(event);
  }

  async findAll(token: string, query: QueryEventDto): Promise<Event[]> {
    const client = await this.supabaseService.getUserClient(token);
    let queryBuilder = client
      .from('events')
      .select(`
        *,
        companies:company_id (name),
        profiles:user_id (fullname),
        sub_types:sub_type_id (name)
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
        profiles:user_id (fullname),
        sub_types:sub_type_id (name),
        event_images!event_images_event_id_fkey (url),
        event_checkins!event_checkins_event_id_fkey (detail, created_at)
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
    const { data: event, error } = await client
      .from('events')
      .update(updateEventDto)
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

    return this.transformEventData(event);
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

  private transformEventData(event: any): Event {
    return {
      ...event,
      companyName: event.companies?.name,
      userFullName: event.profiles?.fullname,
      subTypeName: event.sub_types?.name,
      eventImages: event.event_images?.map((image: { url: string }) => image.url),
      eventCheckins: event.event_checkins?.map((checkin: { detail: string, created_at: string }) => ({
        detail: checkin.detail,
        created_at: checkin.created_at
      })),
      companies: undefined,
      profiles: undefined,
      sub_types: undefined,
      event_images: undefined,
      event_checkins: undefined,
    };
  }
} 