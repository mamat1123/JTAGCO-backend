import { Module, forwardRef } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CustomerModule } from '../customer/customer.module';
import { SharedModule } from '../../shared/shared.module';
import { CompanyIdService } from './services/company-id.service';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [
    forwardRef(() => CustomerModule),
    SharedModule,
    ProfilesModule
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService, CompanyIdService],
  exports: [CompaniesService],
})
export class CompaniesModule {} 