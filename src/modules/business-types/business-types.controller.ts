import { Controller, Get, Req } from '@nestjs/common';
import { BusinessTypesService } from './business-types.service';
import { BusinessTypeDto } from './dto/business-type.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('business-types')
@Controller('business-types')
export class BusinessTypesController {
  constructor(private readonly businessTypesService: BusinessTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all business types' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of business types',
    type: [BusinessTypeDto],
  })
  async findAll(@Req() req: Request): Promise<BusinessTypeDto[]> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('No authorization token provided');
    }
    return this.businessTypesService.findAll(token);
  }
} 