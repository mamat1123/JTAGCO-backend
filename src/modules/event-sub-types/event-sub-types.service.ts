import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../shared/services/supabase.service';
import { EventSubTypeResponseDto } from './dto/event-sub-type.dto';
import {
  CreateEventSubTypeDto,
  UpdateEventSubTypeDto,
} from './dto/event-sub-type.dto';

@Injectable()
export class EventSubTypesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(token: string): Promise<EventSubTypeResponseDto[]> {
    const client = await this.supabaseService.getUserClient(token);
    const { data, error } = await client
      .from('event_sub_types')
      .select(
        `
        *,
        main_type:main_type_id (*)
      `,
      )
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to fetch event sub types');
    }

    return data;
  }

  async findByMainTypeId(
    mainTypeId: number,
    token: string,
  ): Promise<EventSubTypeResponseDto[]> {
    const client = await this.supabaseService.getUserClient(token);
    const { data, error } = await client
      .from('event_sub_types')
      .select(
        `
        *,
        main_type:main_type_id (*)
      `,
      )
      .eq('main_type_id', mainTypeId)
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to fetch event sub types');
    }

    return data;
  }

  async create(
    createEventSubTypeDto: CreateEventSubTypeDto,
    token: string,
  ): Promise<EventSubTypeResponseDto> {
    const client = await this.supabaseService.getUserClient(token);
    const { data, error } = await client
      .from('event_sub_types')
      .insert(createEventSubTypeDto)
      .select(
        `
        *,
        main_type:main_type_id (*)
      `,
      )
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to create event sub type');
    }

    return data;
  }

  async update(
    id: number,
    updateEventSubTypeDto: UpdateEventSubTypeDto,
    token: string,
  ): Promise<EventSubTypeResponseDto> {
    const client = await this.supabaseService.getUserClient(token);
    const { data, error } = await client
      .from('event_sub_types')
      .update(updateEventSubTypeDto)
      .eq('id', id)
      .select(
        `
        *,
        main_type:main_type_id (*)
      `,
      )
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to update event sub type');
    }

    return data;
  }

  async remove(id: number, token: string): Promise<void> {
    const client = await this.supabaseService.getUserClient(token);
    const { error } = await client
      .from('event_sub_types')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to delete event sub type');
    }
  }
}
