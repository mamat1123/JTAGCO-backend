import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('supabase.url');
    const supabaseKey = this.configService.get<string>('supabase.key');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getClient(token?: string): Promise<SupabaseClient> {
    if (token) {
      await this.supabase.auth.setSession({
        access_token: token,
        refresh_token: '',
      });
    }
    return this.supabase;
  }

  async getUser(token: string) {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser(token);
      if (error) throw error;
      return user;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }
} 