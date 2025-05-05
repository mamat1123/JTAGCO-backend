import { Module, forwardRef } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { SupabaseService } from '../../services/supabase.service';
import { AuthGuard } from '../../guards/auth.guard';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [forwardRef(() => CustomerModule)],
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    SupabaseService,
    AuthGuard,
  ],
  exports: [CompaniesService],
})
export class CompaniesModule {} 