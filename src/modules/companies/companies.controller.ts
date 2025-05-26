import { Controller, Get, Post, Body, Param, Query, UseGuards, UnauthorizedException, HttpCode, HttpStatus, NotFoundException, Put } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { SearchCompanyDto } from './dto/search-company.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AuthUser, AuthUserData } from '../../shared/decorators/auth-user.decorator';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ProfilesService } from '../profiles/profiles.service';

@Controller('companies')
@UseGuards(AuthGuard)
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly profilesService: ProfilesService,
  ) {}  

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @AuthUser() auth: AuthUserData,
    @Body() createCompanyDto: CreateCompanyDto
  ): Promise<Company> {
    // Get profile ID from profiles service
    const profile = await this.profilesService.findProfileIdByUserId(auth.user.id, auth.token);
    
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    return this.companiesService.create(
      profile.id.toString(),
      createCompanyDto,
      auth.token
    );
  }

  @Get()
  async findAll(
    @AuthUser() auth: AuthUserData,
    @Query() searchParams: SearchCompanyDto
  ): Promise<{ data: Company[], total: number }> {
    return this.companiesService.findAll(auth.user.id, searchParams, auth.token);
  }

  @Get('user/:userId')
  async findByUserId(
    @AuthUser() auth: AuthUserData,
    @Param('userId') userId: string,
    @Query() pagination: PaginationDto
  ): Promise<{ data: Company[], total: number }> {
    // Ensure user can only access their own data
    if (auth.user.id !== userId) {
      throw new UnauthorizedException('You can only access your own companies');
    }
    return this.companiesService.findByUserId(userId, pagination, auth.token);
  }

  @Get(':id')
  async findOne(
    @AuthUser() auth: AuthUserData,
    @Param('id') id: string
  ): Promise<Company> {
    return this.companiesService.findOne(id, auth.user.id, auth.token);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @AuthUser() auth: AuthUserData,
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto
  ): Promise<Company> {
    return this.companiesService.update(id, auth.user.id, updateCompanyDto, auth.token);
  }
}
