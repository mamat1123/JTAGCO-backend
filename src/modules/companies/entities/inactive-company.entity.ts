export class InactiveCompany {
  id: string;
  name: string;
  province: string;
  branch: string;
  totalEmployees: number;
  credit: number;
} 

export class InactiveCompanyStats {
  total_companies: number;
  total_employees: number;
  avg_credit: number;
  never_updated: number;
}