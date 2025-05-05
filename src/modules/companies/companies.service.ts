import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { SupabaseService } from '../../services/supabase.service';
import { Company } from './entities/company.entity';
import { PaginationDto } from './dto/pagination.dto';
import { SearchCompanyDto } from './dto/search-company.dto';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class CompaniesService {
  constructor(
    private supabaseService: SupabaseService,
    @Inject(forwardRef(() => CustomerService))
    private customerService: CustomerService
  ) {}

  async findAll(searchParams: SearchCompanyDto): Promise<{ data: Company[], total: number }> {
    console.log('Starting findAll with search params:', searchParams);
    
    try {
      const { page = 1, limit = 10, search } = searchParams;
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      let query = this.supabaseService.client
        .from('companies')
        .select('*', { count: 'exact' });

      // Apply search filter if provided
      if (search) {
        query = query.or(`id.ilike.%${search}%,name.ilike.%${search}%`);
      }

      // Get total count and data in one query
      const { data, error, count } = await query
        .range(start, end)
        .order('created_at', { ascending: false });

      console.log('Supabase response:', { data, error, count });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to fetch companies: ${error.message}`);
      }

      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Exception in findAll:', error);
      throw error;
    }
  }

  async findByUserId(userId: string, pagination: PaginationDto): Promise<{ data: Company[], total: number }> {
    console.log('Starting findByUserId with userId:', userId, 'pagination:', pagination);
    
    try {
      const { page = 1, limit = 10 } = pagination;
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      // Get total count for this user
      const { count } = await this.supabaseService.client
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get paginated data for this user with customers
      const { data, error } = await this.supabaseService.client
        .from('companies')
        .select(`
          *,
          customer (
            id,
            contact_name,
            position,
            email,
            phone,
            line_id,
            image_url,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', userId)
        .range(start, end)
        .order('created_at', { ascending: false });

      console.log('Supabase response:', { data, error, count });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to fetch companies for user ${userId}: ${error.message}`);
      }

      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Exception in findByUserId:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Company> {
    console.log('Starting findOne with id:', id);
    
    try {
      // First, get the company
      const { data: company, error: companyError } = await this.supabaseService.client
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (companyError) {
        console.error('Supabase error:', companyError);
        throw new NotFoundException(`Company with ID ${id} not found`);
      }

      // Then, get the customers using CustomerService
      const customers = await this.customerService.findByCompanyId(id);

      // Combine the data
      const result = {
        ...company,
        customers: customers || []
      };

      console.log('Combined response:', result);

      return result;
    } catch (error) {
      console.error('Exception in findOne:', error);
      throw error;
    }
  }
} 