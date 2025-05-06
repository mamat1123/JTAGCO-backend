import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../shared/services/supabase.service';

@Injectable()
export class ProfilesService {
  constructor(private supabaseService: SupabaseService) {}

  async findProfileIdByUserId(userId: string, token: string): Promise<string> {
    const client = await this.supabaseService.getUserClient(token);
    const { data, error } = await client
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error(`Failed to find profile for user ${userId}: ${error.message}`);
    }

    return data.id;
  }
} 