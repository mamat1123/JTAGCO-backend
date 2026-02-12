import { Controller, Get, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardMetricsDto } from './dto/dashboard-metrics.dto';
import { User } from '@supabase/supabase-js';
import { Request as ExpressRequest } from 'express';

interface RequestWithUser extends ExpressRequest {
  user: User;
}

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Get dashboard metrics for the current month with month-over-month changes
   */
  @Get('sales/metrics')
  async getSalesMetrics(
    @Req() req: RequestWithUser,
  ): Promise<DashboardMetricsDto> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('No authorization token provided');
    }
    return this.dashboardService.getSalesMetrics(token);
  }
}
