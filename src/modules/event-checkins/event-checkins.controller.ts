import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UnauthorizedException,
  Body,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventCheckinsService } from './event-checkins.service';
import { EventCheckinDto } from './dto/event-checkin.dto';
import { RequestWithUser } from 'src/shared/interfaces/request.interface';
import { CreateEventCheckinDto } from './dto/create-event-checkin.dto';

@ApiTags('Event Check-ins')
@Controller('event-checkins')
export class EventCheckinsController {
  constructor(private readonly eventCheckinsService: EventCheckinsService) {}

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get all check-ins for a specific event' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of event check-ins',
    type: [EventCheckinDto],
  })
  @ApiResponse({ status: 400, description: 'Invalid event ID format' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getByEventId(
    @Req() req: RequestWithUser,
    @Param('eventId', ParseUUIDPipe) eventId: string,
  ): Promise<EventCheckinDto[]> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return this.eventCheckinsService.getByEventId(eventId, token);
  }

  @Post('event/:eventId/checkin')
  @ApiOperation({ summary: 'Create a new check-in for a specific event' })
  @ApiResponse({
    status: 201,
    description: 'Returns the created check-in',
    type: EventCheckinDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid event ID format or request body',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createCheckin(
    @Req() req: RequestWithUser,
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Body() createEventCheckinDto: CreateEventCheckinDto,
  ): Promise<EventCheckinDto> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return this.eventCheckinsService.create(
      eventId,
      createEventCheckinDto,
      token,
    );
  }
}
