import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { AuthError, User } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async signUp(email: string, password: string) {
    const client = await this.supabaseService.getClient();
    const { data, error } = await client.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const client = await this.supabaseService.getClient();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const client = await this.supabaseService.getClient();
    const { error } = await client.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    const client = await this.supabaseService.getClient();
    const { data: { user }, error } = await client.auth.getUser();
    if (error) throw error;
    return user;
  }
} 