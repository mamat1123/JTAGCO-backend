import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private readonly supabaseClient: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    this.supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  get client(): SupabaseClient {
    return this.supabaseClient;
  }

  /**
   * Client สำหรับ backend ใช้งานทั่วไป (ไม่ใช้ RLS)
   */
  getAdminClient(): SupabaseClient {
    return this.supabaseClient;
  }

  /**
   * Gets a Supabase client instance for the authenticated user
   * @param token - The JWT token
   * @returns A Supabase client instance
   */
  async getUserClient(token: string): Promise<SupabaseClient> {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    // Ensure token is properly formatted
    const formattedToken = token.startsWith('Bearer ')
      ? token
      : `Bearer ${token}`;

    return await Promise.resolve(
      createClient(supabaseUrl, supabaseKey, {
        global: {
          headers: {
            Authorization: formattedToken,
          },
        },
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }),
    );
  }
}
