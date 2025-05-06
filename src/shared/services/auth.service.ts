import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { User } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Validates a JWT token and returns the associated user
   * @param token - The JWT token to validate
   * @returns The authenticated user
   * @throws UnauthorizedException if token is invalid or user not found
   */
  async validateToken(token: string): Promise<User> {
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Format token for validation
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const client = await this.supabaseService.getUserClient(formattedToken);
      const { data: { user }, error } = await client.auth.getUser();

      if (error || !user) {
        console.error('Token validation error:', error);
        throw new UnauthorizedException('Invalid token');
      }

      return user;
    } catch (error) {
      console.error('Token validation error:', error);
      throw new UnauthorizedException('Failed to validate token');
    }
  }
} 