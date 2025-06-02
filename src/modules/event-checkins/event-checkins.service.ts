import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../shared/services/supabase.service';
import { EventCheckinDto } from './dto/event-checkin.dto';
import { CreateEventCheckinDto } from './dto/create-event-checkin.dto';

@Injectable()
export class EventCheckinsService {
  constructor(private readonly supabaseService: SupabaseService) {}

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

    // Start a transaction
    const { data: checkin, error: checkinError } = await client
      .from('event_checkins')
      .insert({
        event_id: eventId,
        detail: createEventCheckinDto.detail,
        checkin_at: new Date().toISOString(),
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

    return {
      id: checkin.id,
      eventId: checkin.event_id,
      checkin_at: checkin.checkin_at,
      detail: checkin.detail,
      created_at: checkin.created_at,
    };
  }
} 