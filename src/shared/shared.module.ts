import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './services/supabase.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    SupabaseService,
    AuthService,
    AuthGuard,
  ],
  exports: [
    SupabaseService,
    AuthService,
    AuthGuard,
  ],
})
export class SharedModule {} 