import { Controller, Get, Param, Query, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { SupabaseAuthGuard } from '../../shared/guards/supabase-auth.guard';
import { SearchCompanyDto } from './dto/search-company.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('companies')
@UseGuards(SupabaseAuthGuard)
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
  ) {}  

  @Get()
  async findAll(
    @Request() req,
    @Query() searchParams: SearchCompanyDto
  ): Promise<{ data: Company[], total: number }> {
    const token = req.headers.authorization?.split(' ')[1];
    return this.companiesService.findAll(req.user.id, searchParams, token);
  }

  @Get('user/:userId')
  async findByUserId(
    @Request() req,
    @Param('userId') userId: string,
    @Query() pagination: PaginationDto
  ): Promise<{ data: Company[], total: number }> {
    // Ensure user can only access their own data
    if (req.user.id !== userId) {
      throw new UnauthorizedException('You can only access your own companies');
    }
    const token = req.headers.authorization?.split(' ')[1];
    return this.companiesService.findByUserId(userId, pagination, token);
  }

  @Get(':id')
  async findOne(
    @Request() req,
    @Param('id') id: string
  ): Promise<Company> {
    const token = req.headers.authorization?.split(' ')[1];
    return this.companiesService.findOne(id, token);
  }
}
