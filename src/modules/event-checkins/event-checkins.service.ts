import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../../shared/services/supabase.service';
import { EventCheckinDto } from './dto/event-checkin.dto';
import { CreateEventCheckinDto } from './dto/create-event-checkin.dto';

@Injectable()
export class EventCheckinsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private isVisitEventType(mainTypeName: string): boolean {
    return mainTypeName.includes('เข้าพบ');
  }

  private isSameDayAsToday(date: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate.getTime() === today.getTime();
  }

  /**
   * Retrieves all check-ins for a specific event
   * @param eventId - The ID of the event to get check-ins for
   * @returns Promise<EventCheckinDto[]> - Array of event check-ins
   */
  async getByEventId(eventId: string, token: string): Promise<EventCheckinDto[]> {
    const client = await this.supabaseService.getUserClient(token);
    const { data, error } = await client
      .from('event_checkins')
      .select('*')
      .eq('event_id', eventId)
      .order('checkin_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch event check-ins: ${error.message}`);
    }

    return data.map((checkin) => ({
      id: checkin.id,
      eventId: checkin.event_id,
      checkin_at: checkin.checkin_at,
      detail: checkin.detail,
      images: checkin.images || [],
      product_selections: checkin.product_selections || [],
      delivery_duration: checkin.delivery_duration,
      purchase_type: checkin.purchase_type,
      purchase_months: checkin.purchase_months || [],
      competitor_brand: checkin.competitor_brand,
      special_requirements: checkin.special_requirements,
      created_at: checkin.created_at,
    }));
  }

  /**
   * Creates a new check-in for a specific event
   * @param eventId - The ID of the event to create check-in for
   * @param createEventCheckinDto - The check-in data
   * @param token - The authentication token
   * @returns Promise<EventCheckinDto> - The created check-in
   */
  async create(eventId: string, createEventCheckinDto: CreateEventCheckinDto, token: string): Promise<EventCheckinDto> {
    const client = await this.supabaseService.getUserClient(token);

    // Get event details to check if it's a visit event and validate date
    const { data: event, error: getEventError } = await client
      .from('events')
      .select('scheduled_at, main_type_id, status')
      .eq('id', eventId)
      .single();

    if (getEventError) {
      throw new Error(`Failed to get event: ${getEventError.message}`);
    }

    // Get main type name
    const { data: mainType, error: mainTypeError } = await client
      .from('event_main_types')
      .select('name')
      .eq('id', event.main_type_id)
      .single();

    if (mainTypeError) {
      throw new Error(`Failed to get event main type: ${mainTypeError.message}`);
    }

    // Validate check-in for visit events - must be on the same day as scheduled
    if (this.isVisitEventType(mainType.name)) {
      if (!this.isSameDayAsToday(event.scheduled_at)) {
        throw new BadRequestException('กิจกรรมนี้ผ่านวันไปแล้วไม่สามารถ checkin ได้');
      }
    }

    // Start a transaction
    const { data: checkin, error: checkinError } = await client
      .from('event_checkins')
      .insert({
        event_id: eventId,
        detail: createEventCheckinDto.detail,
        checkin_at: new Date().toISOString(),
        images: createEventCheckinDto.images || [],
        product_selections: createEventCheckinDto.product_selections || [],
        delivery_duration: createEventCheckinDto.delivery_duration,
        purchase_type: createEventCheckinDto.purchase_type,
        purchase_months: createEventCheckinDto.purchase_months || [],
        competitor_brand: createEventCheckinDto.competitor_brand,
        special_requirements: createEventCheckinDto.special_requirements,
      })
      .select()
      .single();

    if (checkinError) {
      throw new Error(`Failed to create event check-in: ${checkinError.message}`);
    }

    // Insert event images if they exist
    if (createEventCheckinDto.images && createEventCheckinDto.images.length > 0) {
      const eventImages = createEventCheckinDto.images.map(url => ({
        event_id: eventId,
        url,
        type: 'checkin',
      }));

      const { error: imagesError } = await client
        .from('event_images')
        .insert(eventImages);

      if (imagesError) {
        throw new Error(`Failed to create event images: ${imagesError.message}`);
      }
    }

    // Only update if not already completed
    if (event.status !== 'completed') {
      const { error: eventError } = await client
        .from('events')
        .update({ status: 'completed' })
        .eq('id', eventId);

      if (eventError) {
        throw new Error(`Failed to update event status: ${eventError.message}`);
      }
    }

    return {
      id: checkin.id,
      eventId: checkin.event_id,
      checkin_at: checkin.checkin_at,
      detail: checkin.detail,
      images: checkin.images || [],
      product_selections: checkin.product_selections || [],
      delivery_duration: checkin.delivery_duration,
      purchase_type: checkin.purchase_type,
      purchase_months: checkin.purchase_months || [],
      competitor_brand: checkin.competitor_brand,
      special_requirements: checkin.special_requirements,
      created_at: checkin.created_at,
    };
  }
} 