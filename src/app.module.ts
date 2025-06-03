import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import supabaseConfig from './config/supabase.config';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { CustomerModule } from './modules/customers/customer.module';
import { SharedModule } from './shared/shared.module';
import { ProductsModule } from './modules/products/products.module';
import { EventsModule } from './modules/events/events.module';
import { EventMainTypesModule } from './modules/event-main-types/event-main-types.module';
import { EventSubTypesModule } from './modules/event-sub-types/event-sub-types.module';
import { BusinessTypesModule } from './modules/business-types/business-types.module';
import { EventCheckinsModule } from './modules/event-checkins/event-checkins.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [supabaseConfig],
    }),
    SharedModule,
    AuthModule,
    CompaniesModule,
    ProfilesModule,
    CustomerModule,
    ProductsModule,
    EventsModule,
    EventMainTypesModule,
    EventSubTypesModule,
    BusinessTypesModule,
    EventCheckinsModule,
    DashboardModule,
  ],
})
export class AppModule { }