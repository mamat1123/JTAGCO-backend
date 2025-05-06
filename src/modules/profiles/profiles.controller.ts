import { Controller, Get, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { SupabaseAuthGuard } from '../../shared/guards/supabase-auth.guard';
import { Request as ExpressRequest } from 'express';
import { User } from '@supabase/supabase-js';

interface RequestWithUser extends ExpressRequest {
  user: User;
}

@Controller('profiles')
@UseGuards(SupabaseAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('user/:userId')
  async findProfileIdByUserId(
    @Req() req: RequestWithUser,
    @Param('userId') userId: string
  ): Promise<string> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return this.profilesService.findProfileIdByUserId(userId, token);
  }
} 