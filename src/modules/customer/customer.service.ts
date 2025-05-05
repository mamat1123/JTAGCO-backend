import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { SupabaseService } from '../../services/supabase.service';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class CustomerService {
  constructor(
    private readonly supabaseService: SupabaseService,
    @Inject(forwardRef(() => CompaniesService))
    private readonly companiesService: CompaniesService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Verify company exists before creating customer
   const company = await this.companiesService.findOne(createCustomerDto.company_id);

    if (!company) {
      throw new BadRequestException(`Company with ID ${createCustomerDto.company_id} not found`);
    }

    const { data: customer, error } = await this.supabaseService.client
      .from('customer')
      .insert(createCustomerDto)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new BadRequestException('Failed to create customer: ' + error.message);
    }

    return customer;
  }

  async findAll(): Promise<Customer[]> {
    const { data: customers, error } = await this.supabaseService.client
      .from('customer')
      .select('*');

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to fetch customers');
    }

    return customers;
  }

  async findOne(id: string): Promise<Customer> {
    const { data: customer, error } = await this.supabaseService.client
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

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const { data: customer, error } = await this.supabaseService.client
      .from('customer')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    const { data: updatedCustomer, error: updateError } = await this.supabaseService.client
      .from('customer')
      .update(updateCustomerDto)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Supabase error:', updateError);
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return updatedCustomer;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('customer')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
  }

  async findByCompanyId(companyId: string): Promise<Customer[]> {
    // First, let's verify the company exists and get its user_id
    const { data: company, error: companyError } = await this.supabaseService.client
      .from('companies')
      .select('user_id')
      .eq('id', companyId)
      .single();

    console.log('Company data:', company);

    if (companyError) {
      console.error('Company lookup error:', companyError);
      throw new Error('Failed to verify company ownership');
    }

    // Now get the customers
    const { data: customers, error } = await this.supabaseService.client
      .from('customer')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    console.log('Supabase response:', { data: customers, error });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to fetch customers by company ID');
    }

    return customers;
  }
} 