import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private readonly supabaseUrl: string;
  private readonly supabaseAnonKey: string;
  private readonly adminClient: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabaseUrl = this.configService.get<string>('supabase.url')!;
    this.supabaseAnonKey = this.configService.get<string>('supabase.key')!;

    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      throw new Error('Missing Supabase configuration');
    }

    this.adminClient = createClient(this.supabaseUrl, this.supabaseAnonKey);
  }

  /**
   * Client สำหรับ backend ใช้งานทั่วไป (ไม่ใช้ RLS)
   */
  getAdminClient(): SupabaseClient {
    return this.adminClient;
  }

  /**
   * Client ที่แนบ user token ใช้งานกับ RLS
   */
  async getUserClient(token: string): Promise<SupabaseClient> {
    const client = createClient(this.supabaseUrl, this.supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });
    return client;
  }

  /**
   * ดึง user จาก token
   */
  async getUser(token: string) {
    const client = await this.getUserClient(token);
    const { data: { user }, error } = await client.auth.getUser();
    if (error) throw error;
    return user;
  }
} 