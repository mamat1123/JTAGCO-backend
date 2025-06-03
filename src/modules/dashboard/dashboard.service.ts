import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../shared/services/supabase.service';
import { DashboardMetricsDto, BestSalesUserDto } from './dto/dashboard-metrics.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly supabaseService: SupabaseService) { }

  /**
   * Calculates dashboard metrics for the current month and compares with previous month
   */
  async getSalesMetrics(token: string): Promise<DashboardMetricsDto> {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const firstDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);

    const [
      currentMonthMetrics,
      lastMonthMetrics,
    ] = await Promise.all([
      this.calculateMonthMetrics(firstDayOfMonth, token),
      this.calculateMonthMetrics(firstDayOfLastMonth, token),
    ]);

    return {
      newCompanies: currentMonthMetrics.newCompanies,
      newCompaniesChange: this.calculateChange(
        currentMonthMetrics.newCompanies,
        lastMonthMetrics.newCompanies,
      ),
      eventSuccessRate: currentMonthMetrics.eventSuccessRate,
      eventSuccessRateChange: this.calculateChange(
        currentMonthMetrics.eventSuccessRate,
        lastMonthMetrics.eventSuccessRate,
      ),
      bestSalesUser: currentMonthMetrics.bestSalesUser,
      createdEvents: currentMonthMetrics.createdEvents,
      createdEventsChange: this.calculateChange(
        currentMonthMetrics.createdEvents,
        lastMonthMetrics.createdEvents,
      ),
    };
  }

  /**
   * Calculates metrics for a specific month
   */
  private async calculateMonthMetrics(startDate: Date, token: string): Promise<{
    newCompanies: number;
    eventSuccessRate: number;
    bestSalesUser: BestSalesUserDto;
    createdEvents: number;
  }> {
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    const client = await this.supabaseService.getUserClient(token);

    const { data: bestSalesUser, error } = await client.rpc('best_sales_user_last_month');

    if (error) {
      console.error('Error fetching best sales user:', error);
      throw error;
    }

    // 4. Other metrics (same as before)
    const [
      { count: newCompanies },
      { count: totalEvents },
      { count: totalCheckins },
      { count: createdEvents },
    ] = await Promise.all([
      client
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString()),
      client
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString()),
      client
        .from('event_checkins')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString()),
      client
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString()),
    ]);

    return {
      newCompanies: newCompanies || 0,
      eventSuccessRate: totalEvents ? Number((((totalCheckins || 0) / totalEvents) * 100).toFixed(2)) : 0,
      bestSalesUser: bestSalesUser[0],
      createdEvents: createdEvents || 0,
    };
  }


  /**
   * Calculates the percentage change between two values
   */
  private calculateChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(2));
  }
} 