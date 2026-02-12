import { Module, forwardRef } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CompaniesModule } from '../companies/companies.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [forwardRef(() => CompaniesModule), SharedModule],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
