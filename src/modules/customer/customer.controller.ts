import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('customers')
@UseGuards(AuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return await this.customerService.create(createCustomerDto);
  }

  @Get()
  async findAll(): Promise<Customer[]> {
    return await this.customerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Customer> {
    return await this.customerService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return await this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.customerService.remove(id);
  }
} 