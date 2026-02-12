import { Controller, Get, Headers } from '@nestjs/common';
import { EventMainTypesService } from './event-main-types.service';
import { EventMainTypeDto } from './dto/event-main-type.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Event Main Types')
@Controller('event-main-types')
export class EventMainTypesController {
  constructor(private readonly eventMainTypesService: EventMainTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all event main types' })
  @ApiResponse({
    status: 200,
    description: 'Returns all event main types',
    type: [EventMainTypeDto],
  })
  async findAll(
    @Headers('authorization') token: string,
  ): Promise<EventMainTypeDto[]> {
    return this.eventMainTypesService.findAll(token);
  }
}
