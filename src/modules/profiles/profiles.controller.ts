import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('profiles')
@UseGuards(AuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('/:userId')
  async getProfileId(@Param('userId') userId: string) {
    return this.profilesService.findProfileIdByUserId(userId);
  }
} 