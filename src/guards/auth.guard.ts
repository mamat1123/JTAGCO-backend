import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../services/supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const { data: { user }, error } = await this.supabaseService.client.auth.getUser(token);
      
      if (error || !user) {
        throw new UnauthorizedException('Invalid token');
      }

      // Add user to request for later use
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
} 