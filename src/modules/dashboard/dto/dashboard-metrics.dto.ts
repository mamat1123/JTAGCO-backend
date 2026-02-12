export class BestSalesUserDto {
  userId: string;
  fullname: string;
  eventCount: number;
}

export class DashboardMetricsDto {
  newCompanies: number;
  newCompaniesChange: number;
  eventSuccessRate: number;
  eventSuccessRateChange: number;
  bestSalesUser: BestSalesUserDto;
  createdEvents: number;
  createdEventsChange: number;
}
