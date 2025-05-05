import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from '../../services/supabase.service';

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, SupabaseService],
})
export class AuthModule {} 