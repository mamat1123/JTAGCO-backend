import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('supabase.url');
    const key = this.configService.get<string>('supabase.key');
    
    if (!url || !key) {
      throw new Error('Supabase configuration is missing');
    }

    this.supabase = createClient(url, key);
  }

  get client() {
    return this.supabase;
  }
} 