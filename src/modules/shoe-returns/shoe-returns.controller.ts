import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ShoeReturnsService } from './shoe-returns.service';
import { CreateShoeReturnDto } from './dto/create-shoe-return.dto';
import { ShoeReturnDto } from './dto/shoe-return.dto';
import { ReceiveShoeReturnDto } from './dto/receive-shoe-return.dto';
import { SupabaseAuthGuard } from '../../shared/guards/supabase-auth.guard';
import { ProfilesService } from '../profiles/profiles.service';

@Controller('shoe-returns')
@UseGuards(SupabaseAuthGuard)
export class ShoeReturnsController {
  constructor(
    private readonly shoeReturnsService: ShoeReturnsService,
    private readonly profilesService: ProfilesService,
  ) {}

  @Post()
  async create(
    @Request() req,
    @Body() createShoeReturnDto: CreateShoeReturnDto,
  ): Promise<ShoeReturnDto> {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    const profile = await this.profilesService.findProfileIdByUserId(
      req.user.id,
      token,
    );

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }
    return this.shoeReturnsService.create(
      profile.id.toString(),
      createShoeReturnDto,
      token,
    );
  }

  @Get()
  async findAll(@Request() req): Promise<ShoeReturnDto[]> {
    return this.shoeReturnsService.findAll(req.headers.authorization);
  }

  @Get(':id')
  async findOne(
    @Request() req,
    @Param('id') id: string,
  ): Promise<ShoeReturnDto> {
    return this.shoeReturnsService.findOne(id, req.headers.authorization);
  }

  @Post(':eventShoeVariantId/receive')
  async receive(
    @Request() req,
    @Param('eventShoeVariantId') eventShoeVariantId: string,
    @Body() receiveShoeReturnDto: ReceiveShoeReturnDto,
  ): Promise<ShoeReturnDto> {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    const profile = await this.profilesService.findProfileIdByUserId(
      req.user.id,
      token,
    );

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }
    return this.shoeReturnsService.receive(
      eventShoeVariantId,
      receiveShoeReturnDto,
      profile.id.toString(),
      token,
    );
  }

  @Get('event-shoe-variant/:eventShoeVariantId')
  async findByEventShoeVariantId(
    @Request() req,
    @Param('eventShoeVariantId') eventShoeVariantId: string,
  ): Promise<ShoeReturnDto[]> {
    return this.shoeReturnsService.findByEventShoeVariantId(
      eventShoeVariantId,
      req.headers.authorization,
    );
  }
}
