import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { SearchCompanyDto } from './dto/search-company.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('companies')
@UseGuards(AuthGuard)
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
  ) {}  

  @Get()
  async findAll(@Query() searchParams: SearchCompanyDto): Promise<{ data: Company[], total: number }> {
    return this.companiesService.findAll(searchParams);
  }

  @Get('user/:userId')
  async findByUserId(
    @Param('userId') userId: string,
    @Query() pagination: PaginationDto
  ): Promise<{ data: Company[], total: number }> {
    return this.companiesService.findByUserId(userId, pagination);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Company> {
    return this.companiesService.findOne(id);
  }
}
