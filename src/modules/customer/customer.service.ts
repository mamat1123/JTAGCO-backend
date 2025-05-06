import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
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

  async create(userId: string, createCustomerDto: CreateCustomerDto, token: string): Promise<Customer> {
    // Verify company exists before creating customer
    const company = await this.companiesService.findOne(createCustomerDto.company_id, token);

    if (!company) {
      throw new BadRequestException(`Company with ID ${createCustomerDto.company_id} not found`);
    }

    const client = await this.supabaseService.getUserClient(token);
    const { data: customer, error } = await client
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

  async findAll(userId: string, token: string): Promise<Customer[]> {
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

  async update(userId: string, id: string, updateCustomerDto: UpdateCustomerDto, token: string): Promise<Customer> {
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
    const client = await this.supabaseService.getUserClient(token);
    const { error } = await client
      .from('customer')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
  }

  async findByCompanyId(companyId: string, token: string): Promise<Customer[]> {
    const client = await this.supabaseService.getUserClient(token);
    const { data: customers, error } = await client
      .from('customer')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    console.log('customers', customers);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to fetch customers by company ID');
    }

    return customers;
  }
} 