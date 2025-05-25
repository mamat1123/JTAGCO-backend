import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../shared/services/supabase.service';
import { EventMainTypeDto } from './dto/event-main-type.dto';

@Injectable()
export class EventMainTypesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(token: string): Promise<EventMainTypeDto[]> {
    const client = await this.supabaseService.getUserClient(token);
    
    const { data, error } = await client
      .from('event_main_types')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      throw error;
    }

    return data;
  }
} 