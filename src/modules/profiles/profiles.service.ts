import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../shared/services/supabase.service';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private supabaseService: SupabaseService) {}

  async findProfileIdByUserId(userId: string, token: string): Promise<ProfileDto> {
    const client = await this.supabaseService.getUserClient(token);
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error(`Failed to find profile for user ${userId}: ${error.message}`);
    }

    return data;
  }

  async getAll(token: string): Promise<ProfileDto[]> {
    const client = await this.supabaseService.getUserClient(token);
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch profiles: ${error.message}`);
    }

    return data;
  }
} 