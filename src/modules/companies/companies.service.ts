import { Injectable, NotFoundException, Inject, forwardRef, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../shared/services/supabase.service';
import { Company } from './entities/company.entity';
import { PaginationDto } from './dto/pagination.dto';
import { SearchCompanyDto } from './dto/search-company.dto';
import { CustomerService } from '../customer/customer.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyIdService } from './services/company-id.service';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly companyIdService: CompanyIdService,
    @Inject(forwardRef(() => CustomerService))
    private customerService: CustomerService
  ) {}

  async create(profileId: string, createCompanyDto: CreateCompanyDto, token: string): Promise<Company> {
    console.log('Starting create with profileId:', profileId, 'createCompanyDto:', createCompanyDto);
    
    try {
      // Generate company ID using the profile ID
      const companyId = await this.companyIdService.generateCompanyId(
        token,
        profileId
      );

      console.log('Company ID:', companyId);
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
    console.log('Starting findAll with userId:', userId, 'searchParams:', searchParams);
    
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
        query = query.ilike('name', `%${search}%`);
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
      console.log(companies);

      // Get paginated data
      const { data, error } = await query
        .range(start, end)
        .order('created_at', { ascending: false });
      console.log(data);

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
    console.log('Starting findByUserId with userId:', userId, 'pagination:', pagination);
    
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
    console.log('Starting findOne with id:', id);
    
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

      console.log('Combined response:', result);
      return result;
    } catch (error) {
      console.error('Error in findOne:', error);
      throw error;
    }
  }
} 