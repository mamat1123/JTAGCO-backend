import { Controller, Get, Param, Query, UseGuards, UnauthorizedException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { SearchCompanyDto } from './dto/search-company.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AuthUser, AuthUserData } from '../../shared/decorators/auth-user.decorator';

@Controller('companies')
@UseGuards(AuthGuard)
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
  ) {}  

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
}
