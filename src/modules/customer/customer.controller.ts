import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { SupabaseAuthGuard } from '../../shared/guards/supabase-auth.guard';
import { AuthGuard } from '../../guards/auth.guard';
import { Request as ExpressRequest } from 'express';
import { User } from '@supabase/supabase-js';

interface RequestWithUser extends ExpressRequest {
  user: User;
}

@Controller('customer')
@UseGuards(AuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createCustomerDto: CreateCustomerDto
  ): Promise<Customer> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return await this.customerService.create(req.user.id, createCustomerDto, token);
  }

  @Get()
  async findAll(@Req() req: RequestWithUser): Promise<Customer[]> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return await this.customerService.findAll(req.user.id, token);
  }

  @Get(':id')
  async findOne(
    @Req() req: RequestWithUser,
    @Param('id') id: string
  ): Promise<Customer> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return await this.customerService.findOne(req.user.id, id, token);
  }

  @Patch(':id')
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return await this.customerService.update(req.user.id, id, updateCustomerDto, token);
  }

  @Delete(':id')
  async remove(
    @Req() req: RequestWithUser,
    @Param('id') id: string
  ): Promise<void> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return await this.customerService.remove(req.user.id, id, token);
  }

  @Get('company/:companyId')
  async findByCompanyId(@Req() req: RequestWithUser, @Param('companyId') companyId: string) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return await this.customerService.findByCompanyId(companyId, token);
  }
} 