import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { AuthError, User } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabaseService.client.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabaseService.client.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await this.supabaseService.client.auth.getUser();
    if (error) throw error;
    return user;
  }
} 