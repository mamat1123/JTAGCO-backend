import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Req, UnauthorizedException, Query, NotFoundException, Headers } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { SupabaseAuthGuard } from '../../shared/guards/supabase-auth.guard';
import { RequestWithUser } from '../../shared/interfaces/request.interface';
import { QueryEventDto } from './dto/query-event.dto';
import { ProfilesService } from '../profiles/profiles.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('events')
@UseGuards(SupabaseAuthGuard)
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly profilesService: ProfilesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: RequestWithUser,
    @Body() createEventDto: CreateEventDto,
  ): Promise<Event> {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    const profile = await this.profilesService.findProfileIdByUserId(req.user.id, token);
    
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    return await this.eventsService.create(profile.id.toString(), createEventDto, token);
  }

  @Get()
  async findAll(
    @Req() req: RequestWithUser,
    @Query() query: QueryEventDto,
  ): Promise<Event[]> {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return await this.eventsService.findAll(token, query);
  }

  @Get(':id')
  async findOne(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<Event> {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return await this.eventsService.findOne(req.user.id, id, token);
  }

  @Patch(':id')
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return await this.eventsService.update(req.user.id, id, updateEventDto, token);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<void> {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    await this.eventsService.remove(req.user.id, id, token);
  }

  @Get(':id/request-timeline')
  @ApiOperation({ summary: 'Get event request timeline' })
  @ApiResponse({ status: 200, description: 'Returns the event request timeline' })
  async getEventRequestTimeline(
    @Param('id') id: string,
    @Headers('authorization') token: string,
  ) {
    return this.eventsService.getEventRequestTimeline(id, token);
  }

  @Patch(':id/receive-shoe-variants')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update all event shoe variants status to received' })
  @ApiResponse({ status: 204, description: 'Event shoe variants status updated successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async updateEventShoeVariantsToReceive(
    @Param('id') id: string,
    @Headers('authorization') token: string,
  ): Promise<void> {
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    await this.eventsService.updateEventShoeVariantsToReceive(id, token);
  }
} 