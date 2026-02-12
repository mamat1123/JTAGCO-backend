import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { SupabaseService } from '../../shared/services/supabase.service';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class CustomerService {
  constructor(
    private readonly supabaseService: SupabaseService,
    @Inject(forwardRef(() => CompaniesService))
    private readonly companiesService: CompaniesService,
  ) {}

  private async generateCustomerId(token: string): Promise<string> {
    const client = await this.supabaseService.getUserClient(token);

    // Get the latest customer ID
    const { data: latestCustomer, error } = await client
      .from('customer')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" error
      console.error('Error fetching latest customer ID:', error);
      throw new Error('Failed to generate customer ID');
    }

    // If no customers exist yet, start with 1
    if (!latestCustomer) {
      return '1';
    }

    // Increment the last number
    const nextNumber = parseInt(latestCustomer.id) + 1;
    return nextNumber.toString();
  }

  async create(
    userId: string,
    createCustomerDto: CreateCustomerDto,
    token: string,
  ): Promise<Customer> {
    // Verify company exists before creating customer
    const company = await this.companiesService.findOne(
      createCustomerDto.company_id,
      userId,
      token,
    );

    if (!company) {
      throw new BadRequestException(
        `Company with ID ${createCustomerDto.company_id} not found`,
      );
    }

    // Get authenticated client for RLS
    const client = await this.supabaseService.getUserClient(token);

    const customerId = await this.generateCustomerId(token);
    console.log('customerId', customerId);

    const customerData = {
      ...createCustomerDto,
      id: customerId,
    };

    const { data: customer, error } = await client
      .from('customer')
      .insert(customerData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === '23505') {
        throw new BadRequestException(
          'A customer with this information already exists',
        );
      }
      throw new Error('Failed to create customer');
    }

    return customer;
  }

  async findAll(userId: string, token: string): Promise<Customer[]> {
    // Get authenticated client for RLS
    const client = await this.supabaseService.getUserClient(token);

    const { data: customers, error } = await client
      .from('customer')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to fetch customers');
    }

    return customers;
  }

  async findOne(userId: string, id: string, token: string): Promise<Customer> {
    // Get authenticated client for RLS
    const client = await this.supabaseService.getUserClient(token);

    const { data: customer, error } = await client
      .from('customer')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(
    userId: string,
    id: string,
    updateCustomerDto: UpdateCustomerDto,
    token: string,
  ): Promise<Customer> {
    // Get authenticated client for RLS
    const client = await this.supabaseService.getUserClient(token);

    const { data: customer, error } = await client
      .from('customer')
      .update(updateCustomerDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async remove(userId: string, id: string, token: string): Promise<void> {
    // Get authenticated client for RLS
    const client = await this.supabaseService.getUserClient(token);

    const { error } = await client.from('customer').delete().eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to delete customer');
    }
  }

  async findByCompanyId(companyId: string, token: string): Promise<Customer[]> {
    // Get authenticated client for RLS
    const client = await this.supabaseService.getUserClient(token);

    const { data: customers, error } = await client
      .from('customer')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to fetch customers');
    }

    return customers;
  }
}
