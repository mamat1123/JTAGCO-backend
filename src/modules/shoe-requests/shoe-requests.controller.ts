import { Controller, Get, Post, Body, Param, UseGuards, Request, Query, Patch, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ShoeRequestsService } from './shoe-requests.service';
import { CreateShoeRequestDto } from './dto/create-shoe-request.dto';
import { ShoeRequestDto } from './dto/shoe-request.dto';
import { ShoeRequestStatus } from './dto/shoe-request.dto';
import { SupabaseAuthGuard } from '../../shared/guards/supabase-auth.guard';
import { ProfilesService } from '../profiles/profiles.service';
import { FindAllShoeRequestDto } from './dto/find-all-shoe-request.dto';

@Controller('shoe-requests')
@UseGuards(SupabaseAuthGuard)
export class ShoeRequestsController {
  constructor(
    private readonly shoeRequestsService: ShoeRequestsService,
    private readonly profilesService: ProfilesService,
  ) {}

  @Post()
  async create(
    @Request() req,
    @Body() createShoeRequestDto: CreateShoeRequestDto,
  ): Promise<ShoeRequestDto> {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    const profile = await this.profilesService.findProfileIdByUserId(req.user.id, token);
    
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }
    return this.shoeRequestsService.create(profile.id.toString(), createShoeRequestDto, token);
  }

  @Get()
  async findAll(
    @Request() req,
    @Query() query: FindAllShoeRequestDto,
  ): Promise<{ data: ShoeRequestDto[], total: number }> {
    return this.shoeRequestsService.findAll(req.headers.authorization, query.eventId, query);
  }

  @Get(':id')
  async findOne(
    @Request() req,
    @Param('id') id: string,
  ): Promise<ShoeRequestDto> {
    return this.shoeRequestsService.findOne(id, req.headers.authorization);
  }

  @Patch(':id/status')
  async updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body('status') status: ShoeRequestStatus,
    @Body('reason') reason?: string,
  ): Promise<ShoeRequestDto> {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    const profile = await this.profilesService.findProfileIdByUserId(req.user.id, token);
    
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }
    return this.shoeRequestsService.updateStatus(
      id,
      status,
      profile.id.toString(),
      token,
      reason,
    );
  }
} 