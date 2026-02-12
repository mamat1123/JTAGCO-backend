import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../shared/services/supabase.service';
import { ProfileDto } from './dto/profile.dto';
import { ApproveProfileDto } from './dto/approve-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private supabaseService: SupabaseService) {}

  async findProfileIdByUserId(
    userId: string,
    token: string,
  ): Promise<ProfileDto> {
    const client = await this.supabaseService.getUserClient(token);
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error(
        `Failed to find profile for user ${userId}: ${error.message}`,
      );
    }

    return data;
  }

  async getAll(token: string): Promise<ProfileDto[]> {
    const client = await this.supabaseService.getUserClient(token);
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch profiles: ${error.message}`);
    }

    return data;
  }

  async updateLastActive(userId: string, token: string): Promise<void> {
    const client = await this.supabaseService.getUserClient(token);
    const { error } = await client
      .from('profiles')
      .update({
        last_active_at: new Date().toISOString(),
        is_online: true,
      })
      .eq('user_id', userId);

    if (error) {
      throw new Error(
        `Failed to update last active status for user ${userId}: ${error.message}`,
      );
    }
  }

  async approve(
    profileId: number,
    approveProfileDto: ApproveProfileDto,
    token: string,
  ): Promise<ProfileDto> {
    const client = await this.supabaseService.getUserClient(token);
    // First check if profile exists
    const { data: existingProfile, error: fetchError } = await client
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (fetchError || !existingProfile) {
      throw new NotFoundException(`Profile with ID ${profileId} not found`);
    }

    // Update profile status
    const { data: updatedProfile, error: updateError } = await client
      .from('profiles')
      .update({ status: approveProfileDto.status })
      .eq('id', profileId)
      .select()
      .single();

    if (updateError) {
      throw new Error(
        `Failed to update profile status: ${updateError.message}`,
      );
    }

    return updatedProfile;
  }
}
