import { Injectable, NotFoundException, Inject, forwardRef, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../shared/services/supabase.service';
import { Company } from './entities/company.entity';
import { PaginationDto } from './dto/pagination.dto';
import { SearchCompanyDto } from './dto/search-company.dto';
import { CustomerService } from '../customers/customer.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyIdService } from './services/company-id.service';
import { InactiveCompaniesDto } from './dto/inactive-companies.dto';
import { InactiveCompany, InactiveCompanyStats } from './entities/inactive-company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly companyIdService: CompanyIdService,
    @Inject(forwardRef(() => CustomerService))
    private customerService: CustomerService
  ) { }

  async create(profileId: string, createCompanyDto: CreateCompanyDto, token: string): Promise<Company> {

    try {
      // Generate company ID using the profile ID
      const companyId = await this.companyIdService.generateCompanyId(
        token,
        profileId
      );
      // Get authenticated client for RLS
      const client = await this.supabaseService.getUserClient(token);

      // Insert the new company
      const { data: company, error } = await client
        .from('companies')
        .insert({
          ...createCompanyDto,
          id: companyId,
          user_id: profileId // Use the profile ID as user_id
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to create company: ${error.message}`);
      }

      return company;
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  async findAll(userId: string, searchParams: SearchCompanyDto, token: string): Promise<{ data: Company[], total: number }> {

    try {
      const { page = 1, limit = 10, search, name, province, email, user_id } = searchParams;
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      // Get authenticated client for RLS
      const client = await this.supabaseService.getUserClient(token);

      let query = client
        .from('companies')
        .select('*', { count: 'exact' });

      // Apply user_id filter if provided
      if (user_id) {
        query = query.eq('user_id', user_id);
      }

      // Apply search filter if provided
      if (search) {
        query = query.or(`name.ilike.%${search}%,id.ilike.%${search}%`);
      }

      // Apply specific filters
      if (name) {
        query = query.ilike('name', `%${name}%`);
      }

      if (province) {
        query = query.ilike('province', `%${province}%`);
      }

      if (email) {
        query = query.ilike('email', `%${email}%`);
      }

      // Get total count
      const { count, data: companies } = await query;

      // Get paginated data
      const { data, error } = await query
        .range(start, end)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to fetch companies');
      }

      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findByUserId(userId: string, pagination: PaginationDto, token: string): Promise<{ data: Company[], total: number }> {

    try {
      const { page = 1, limit = 10 } = pagination;
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      // Get authenticated client for RLS
      const client = await this.supabaseService.getUserClient(token);

      // Get total count for this user
      const { count } = await client
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get paginated data for this user with customers
      const { data, error } = await client
        .from('companies')
        .select(`
          *,
          customers:customer(*)
        `)
        .eq('user_id', userId)
        .range(start, end)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to fetch companies');
      }

      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error in findByUserId:', error);
      throw error;
    }
  }

  async findOne(id: string, userId: string, token: string): Promise<Company> {

    try {
      // Get authenticated client for RLS
      const client = await this.supabaseService.getUserClient(token);

      // First, get the company
      const { data: company, error: companyError } = await client
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (companyError) {
        console.error('Company lookup error:', companyError);
        throw new NotFoundException(`Company with ID ${id} not found`);
      }

      if (!company) {
        throw new UnauthorizedException('You do not have access to this company');
      }

      // Then, get the customers using CustomerService
      const customers = await this.customerService.findByCompanyId(id, token);

      // Combine the data
      const result = {
        ...company,
        customers,
      };
      return result;
    } catch (error) {
      console.error('Error in findOne:', error);
      throw error;
    }
  }

  async update(id: string, userId: string, updateCompanyDto: UpdateCompanyDto, token: string): Promise<Company> {

    try {
      // Get authenticated client for RLS
      const client = await this.supabaseService.getUserClient(token);

      // First, check if the company exists and belongs to the user
      const { data: existingCompany, error: checkError } = await client
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (checkError || !existingCompany) {
        console.error('Company lookup error:', checkError);
        throw new NotFoundException(`Company with ID ${id} not found`);
      }

      // Update the company
      const { data: updatedCompany, error: updateError } = await client
        .from('companies')
        .update(updateCompanyDto)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Update error:', updateError);
        throw new Error(`Failed to update company: ${updateError.message}`);
      }

      return updatedCompany;
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  async delete(id: string, userId: string, token: string): Promise<void> {

    try {
      // Get authenticated client for RLS
      const client = await this.supabaseService.getUserClient(token);

      // First, check if the company exists and belongs to the user
      const { data: existingCompany, error: checkError } = await client
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (checkError || !existingCompany) {
        console.error('Company lookup error:', checkError);
        throw new NotFoundException(`Company with ID ${id} not found`);
      }

      // Delete the company
      const { error: deleteError } = await client
        .from('companies')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw new Error(`Failed to delete company: ${deleteError.message}`);
      }
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  async findInactiveCompaniesStats(params: InactiveCompaniesDto, token: string): Promise<{ data: InactiveCompanyStats }> {
    try {
      const { months = 3 } = params;
      const client = await this.supabaseService.getUserClient(token);
      const { data, error } = await client.rpc('get_inactive_companies_summary', { months_back: months });
      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to fetch inactive companies stats');
      }

      return data[0]
    } catch (error) {
      console.error('Error in findInactiveCompaniesStats:', error);
      throw error;
    }
  }

  async findInactiveCompanies(params: InactiveCompaniesDto, token: string): Promise<{ data: InactiveCompany[] }> {
    try {
      const { page = 1, limit = 10, months = 3, sortBy = 'last_event_updated_at', sortOrder = 'desc' } = params;
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      // Get authenticated client for RLS
      const client = await this.supabaseService.getUserClient(token);


      // Call the RPC function to get inactive companies
      const { data, error } = await client
        .rpc('get_inactive_companies', {
          months_back: months,
          start_row: start,
          end_row: end,
          sort_by: sortBy ?? 'last_event_updated_at',
          sort_order: sortOrder ?? 'desc'
        });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to fetch inactive companies');
      }
      // Map to InactiveCompany type
      const cleanedCompanies = data.map(company => ({
        id: company.company_id,
        name: company.company_name,
        province: company.province,
        branch: company.branch,
        totalEmployees: company.total_employees,
        credit: company.credit,
        lastEventUpdatedAt: company.last_event_updated_at
      }));

      return {
        data: cleanedCompanies,
      };
    } catch (error) {
      console.error('Error in findInactiveCompanies:', error);
      throw error;
    }
  }
} 