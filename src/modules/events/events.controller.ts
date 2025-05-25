import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Req, UnauthorizedException, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { SupabaseAuthGuard } from '../../shared/guards/supabase-auth.guard';
import { RequestWithUser } from '../../shared/interfaces/request.interface';
import { QueryEventDto } from './dto/query-event.dto';

@Controller('events')
@UseGuards(SupabaseAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

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
    return await this.eventsService.create(req.user.id, createEventDto, token);
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
} 