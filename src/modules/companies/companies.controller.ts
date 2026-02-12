import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { SearchCompanyDto } from './dto/search-company.dto';
import { PaginationDto } from './dto/pagination.dto';
import {
  AuthUser,
  AuthUserData,
} from '../../shared/decorators/auth-user.decorator';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ProfilesService } from '../profiles/profiles.service';
import { InactiveCompaniesDto } from './dto/inactive-companies.dto';
import { TransferCompanyDto } from './dto/transfer-company.dto';

@Controller('companies')
@UseGuards(AuthGuard)
@ApiTags('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly profilesService: ProfilesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({
    status: 201,
    description: 'Company created successfully',
    type: Company,
  })
  async create(
    @AuthUser() auth: AuthUserData,
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<Company> {
    // Get profile ID from profiles service
    const profile = await this.profilesService.findProfileIdByUserId(
      auth.user.id,
      auth.token,
    );

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    return this.companiesService.create(
      profile.id.toString(),
      createCompanyDto,
      auth.token,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies with optional filtering' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of companies',
    type: [Company],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for company name or ID',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Filter by company name',
  })
  @ApiQuery({
    name: 'province',
    required: false,
    type: String,
    description: 'Filter by province',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    type: String,
    description: 'Filter by email',
  })
  @ApiQuery({
    name: 'user_id',
    required: false,
    type: String,
    description: 'Filter by user ID',
  })
  @ApiQuery({
    name: 'tagged_product_id',
    required: false,
    type: String,
    description:
      'Filter companies that have events with this product ID in event_product_tags',
  })
  async findAll(
    @AuthUser() auth: AuthUserData,
    @Query() searchParams: SearchCompanyDto,
  ): Promise<{ data: Company[]; total: number }> {
    return this.companiesService.findAll(
      auth.user.id,
      searchParams,
      auth.token,
    );
  }

  @Get('inactive')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get inactive companies' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of inactive companies',
  })
  async findInactiveCompanies(
    @AuthUser() auth: AuthUserData,
    @Query() params: InactiveCompaniesDto,
  ) {
    return this.companiesService.findInactiveCompanies(params, auth.token);
  }

  @Get('inactive/stats')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get inactive companies statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns inactive companies statistics',
  })
  async findInactiveCompaniesStats(
    @AuthUser() auth: AuthUserData,
    @Query() params: InactiveCompaniesDto,
  ) {
    return this.companiesService.findInactiveCompaniesStats(params, auth.token);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get companies by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of companies for a specific user',
    type: [Company],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  async findByUserId(
    @AuthUser() auth: AuthUserData,
    @Param('userId') userId: string,
    @Query() pagination: PaginationDto,
  ): Promise<{ data: Company[]; total: number }> {
    // Ensure user can only access their own data
    if (auth.user.id !== userId) {
      throw new UnauthorizedException('You can only access your own companies');
    }
    return this.companiesService.findByUserId(userId, pagination, auth.token);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a specific company',
    type: Company,
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async findOne(
    @AuthUser() auth: AuthUserData,
    @Param('id') id: string,
  ): Promise<Company> {
    return this.companiesService.findOne(id, auth.user.id, auth.token);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update company by ID' })
  @ApiResponse({
    status: 200,
    description: 'Company updated successfully',
    type: Company,
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async update(
    @AuthUser() auth: AuthUserData,
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companiesService.update(
      id,
      auth.user.id,
      updateCompanyDto,
      auth.token,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete company by ID' })
  @ApiResponse({ status: 204, description: 'Company deleted successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async delete(
    @AuthUser() auth: AuthUserData,
    @Param('id') id: string,
  ): Promise<void> {
    return this.companiesService.delete(id, auth.user.id, auth.token);
  }

  @Put(':id/transfer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transfer company to another user' })
  @ApiResponse({
    status: 200,
    description: 'Company transferred successfully',
    type: Company,
  })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async transfer(
    @AuthUser() auth: AuthUserData,
    @Param('id') id: string,
    @Body() transferCompanyDto: TransferCompanyDto,
  ): Promise<Company> {
    return this.companiesService.transfer(
      id,
      transferCompanyDto.user_id,
      auth.token,
    );
  }
}
