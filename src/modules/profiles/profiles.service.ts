import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../services/supabase.service';

@Injectable()
export class ProfilesService {
  constructor(private supabaseService: SupabaseService) {}

  async findProfileIdByUserId(userId: string): Promise<string> {
    console.log('this.supabaseService', this.supabaseService);
    const { data, error } = await this.supabaseService.client
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