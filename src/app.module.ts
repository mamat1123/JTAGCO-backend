import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import supabaseConfig from './config/supabase.config';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { CustomerModule } from './modules/customer/customer.module';
import { SupabaseService } from './services/supabase.service';
import { getTypeOrmConfig } from './config/typeorm.config';

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
    AuthModule,
    CompaniesModule,
    ProfilesModule,
    CustomerModule,
  ],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class AppModule {}