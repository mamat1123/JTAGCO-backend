import { Module, forwardRef } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CustomerModule } from '../customer/customer.module';
import { SharedModule } from '../../shared/shared.module';
import { SupabaseService } from '../../services/supabase.service';

@Module({
  imports: [
    forwardRef(() => CustomerModule),
    SharedModule
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService, SupabaseService],
  exports: [CompaniesService],
})
export class CompaniesModule {} 