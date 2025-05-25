import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseGuards } from '@nestjs/common';
import { EventSubTypesService } from './event-sub-types.service';
import { EventSubTypeResponseDto } from './dto/event-sub-type.dto';
import { CreateEventSubTypeDto, UpdateEventSubTypeDto } from './dto/event-sub-type.dto';
import { SupabaseAuthGuard } from '../../shared/guards/supabase-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Event Sub Types')
@Controller('event-sub-types')
@UseGuards(SupabaseAuthGuard)
export class EventSubTypesController {
  constructor(private readonly eventSubTypesService: EventSubTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all event sub types' })
  @ApiResponse({
    status: 200,
    description: 'Returns all event sub types',
    type: [EventSubTypeResponseDto],
  })
  async findAll(@Headers('authorization') token: string): Promise<EventSubTypeResponseDto[]> {
    return this.eventSubTypesService.findAll(token);
  }

  @Get('main-type/:mainTypeId')
  @ApiOperation({ summary: 'Get event sub types by main type ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns event sub types for the specified main type',
    type: [EventSubTypeResponseDto],
  })
  async findByMainTypeId(
    @Param('mainTypeId') mainTypeId: number,
    @Headers('authorization') token: string,
  ): Promise<EventSubTypeResponseDto[]> {
    return this.eventSubTypesService.findByMainTypeId(mainTypeId, token);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new event sub type' })
  @ApiResponse({
    status: 201,
    description: 'The event sub type has been successfully created',
    type: EventSubTypeResponseDto,
  })
  async create(
    @Body() createEventSubTypeDto: CreateEventSubTypeDto,
    @Headers('authorization') token: string,
  ): Promise<EventSubTypeResponseDto> {
    return this.eventSubTypesService.create(createEventSubTypeDto, token);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an event sub type' })
  @ApiResponse({
    status: 200,
    description: 'The event sub type has been successfully updated',
    type: EventSubTypeResponseDto,
  })
  async update(
    @Param('id') id: number,
    @Body() updateEventSubTypeDto: UpdateEventSubTypeDto,
    @Headers('authorization') token: string,
  ): Promise<EventSubTypeResponseDto> {
    return this.eventSubTypesService.update(id, updateEventSubTypeDto, token);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event sub type' })
  @ApiResponse({
    status: 200,
    description: 'The event sub type has been successfully deleted',
  })
  async remove(
    @Param('id') id: number,
    @Headers('authorization') token: string,
  ): Promise<void> {
    return this.eventSubTypesService.remove(id, token);
  }
} 