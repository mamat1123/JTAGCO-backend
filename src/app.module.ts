import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import supabaseConfig from './config/supabase.config';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { CustomerModule } from './modules/customers/customer.module';
import { SharedModule } from './shared/shared.module';
import { getTypeOrmConfig } from './config/typeorm.config';
import { ProductsModule } from './modules/products/products.module';
import { EventsModule } from './modules/events/events.module';
import { EventMainTypesModule } from './modules/event-main-types/event-main-types.module';
import { EventSubTypesModule } from './modules/event-sub-types/event-sub-types.module';
import { BusinessTypesModule } from './modules/business-types/business-types.module';
import { EventCheckinsModule } from './modules/event-checkins/event-checkins.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [supabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getTypeOrmConfig(configService),
      inject: [ConfigService],
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
  ],
})
export class AppModule {}