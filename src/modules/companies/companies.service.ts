import { Injectable, NotFoundException, Inject, forwardRef, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../shared/services/supabase.service';
import { Company } from './entities/company.entity';
import { PaginationDto } from './dto/pagination.dto';
import { SearchCompanyDto } from './dto/search-company.dto';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly supabaseService: SupabaseService,
    @Inject(forwardRef(() => CustomerService))
    private customerService: CustomerService
  ) {}

  async findAll(userId: string, searchParams: SearchCompanyDto, token: string): Promise<{ data: Company[], total: number }> {
    console.log('Starting findAll with userId:', userId, 'searchParams:', searchParams);
    
    try {
      const { page = 1, limit = 10, search } = searchParams;
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      // Get authenticated client for RLS
      const client = await this.supabaseService.getUserClient(token);
      
      let query = client
        .from('companies')
        .select('*', { count: 'exact' });

      // Apply search filter if provided
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      // Get total count
      const { count } = await query;

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