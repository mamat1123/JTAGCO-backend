import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../shared/services/supabase.service';
import { AuthError, User } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async signUp(email: string, password: string) {
    const client = this.supabaseService.client;
    const { data, error } = await client.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const client = this.supabaseService.client;
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const client = this.supabaseService.client;
    const { error } = await client.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    const client = this.supabaseService.client;
    const { data: { user }, error } = await client.auth.getUser();
    if (error) throw error;
    return user;
  }
} 