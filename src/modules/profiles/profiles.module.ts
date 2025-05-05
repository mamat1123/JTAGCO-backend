import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { SupabaseService } from '../../services/supabase.service';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService, SupabaseService],
  exports: [ProfilesService],
})
export class ProfilesModule {} 