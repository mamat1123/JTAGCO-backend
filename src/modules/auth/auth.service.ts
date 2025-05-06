import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SupabaseService } from '../../services/supabase.service';

@Injectable()
export class AuthService {
  constructor(
    private supabaseService: SupabaseService,
  ) { }

  async register(registerDto: RegisterDto) {
    try {
      const { username, password, phone, role, email } = registerDto;

      // Register user with Supabase Auth
      const mockEmail = `${username}@jtagco.com`;
      const client = await this.supabaseService.getClient();
      const { data: authData, error: authError } = await client.auth.signUp({
        email: mockEmail,
        password,
        options: {
          data: {
            username,
            phone,
            role,
            user_email: mockEmail,
            email
          }
        }
      });

      if (authError) {
        console.error('Supabase Auth Error:', authError);
        throw new UnauthorizedException(authError.message || 'Registration failed');
      }

      if (!authData.user) {
        throw new UnauthorizedException('User creation failed');
      }

      // Wait for the profile to be created (trigger should handle this)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the created profile
      const { data: profile, error: profileError } = await client
        .from('profiles')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Profile Fetch Error:', profileError);
        throw new UnauthorizedException('Failed to fetch user profile');
      }

      return {
        message: 'Registration successful',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          username: profile.username,
          phone: profile.phone,
          role: profile.role,
        }
      };
    } catch (error) {
      console.error('Registration Error:', error);
      throw new UnauthorizedException(error.message || 'Registration failed');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { username, password } = loginDto;

      const mockEmail = `${username}@jtagco.com`;
      const client = await this.supabaseService.getClient();
      const { data: authData, error: authError } = await client.auth.signInWithPassword({
        email: mockEmail,
        password
      });

      if (authError) {
        console.error('Login Error:', authError);
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!authData.user) {
        throw new UnauthorizedException('Login failed');
      }

      // Get profile data including username
      const { data: profile, error: profileError } = await client
        .from('profiles')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Profile Fetch Error:', profileError);
        throw new UnauthorizedException('Failed to fetch user profile');
      }

      return {
        message: 'Login successful',
        session: authData.session,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          username: profile.username,
          phone: profile.phone,
          role: profile.role
        }
      };
    } catch (error) {
      console.error('Login Error:', error);
      throw new UnauthorizedException(error.message || 'Login failed');
    }
  }
} 