import { Module, forwardRef } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { SupabaseService } from 'src/services/supabase.service';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [forwardRef(() => CompaniesModule)],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    SupabaseService,
    AuthGuard,
  ],
  exports: [CustomerService],
})
export class CustomerModule {} 