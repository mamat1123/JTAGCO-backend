import { Controller, Get, Param, UseGuards, Req, UnauthorizedException, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { SupabaseAuthGuard } from '../../shared/guards/supabase-auth.guard';
import { Request as ExpressRequest } from 'express';
import { User } from '@supabase/supabase-js';
import { ProfileDto } from './dto/profile.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApproveProfileDto } from './dto/approve-profile.dto';

interface RequestWithUser extends ExpressRequest {
  user: User;
}

@ApiTags('profiles')
@Controller('profiles')
@UseGuards(SupabaseAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all profiles' })
  @ApiResponse({ status: 200, description: 'Return all profiles', type: [ProfileDto] })
  async getAll(@Req() req: RequestWithUser): Promise<ProfileDto[]> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return this.profilesService.getAll(token);
  }

  @Get('user/:userId')
  async findProfileIdByUserId(
    @Req() req: RequestWithUser,
    @Param('userId') userId: string
  ): Promise<ProfileDto> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return this.profilesService.findProfileIdByUserId(userId, token);
  }

  @Post('last-active')
  @ApiOperation({ summary: 'Update user last active status' })
  @ApiResponse({ status: 200, description: 'Last active status updated successfully' })
  async updateLastActive(@Req() req: RequestWithUser): Promise<void> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    await this.profilesService.updateLastActive(req.user.id, token);
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve or reject a profile' })
  @ApiResponse({ status: 200, description: 'Profile status updated successfully', type: ProfileDto })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async approve(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() approveProfileDto: ApproveProfileDto
  ): Promise<ProfileDto> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    
    return this.profilesService.approve(parseInt(id), approveProfileDto, token);
  }
} 