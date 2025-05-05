import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { Like } from 'typeorm';

@Injectable()
export class CompanyIdService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async generateCompanyId(userId: string): Promise<string> {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Get last 2 digits of year
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Get month (01-12)
    
    // Get the count of companies for this user in the current month
    const count = await this.companyRepository.count({
      where: {
        userId,
        id: Like(`${year}${month}%`),
      },
    });

    // Format the count with leading zeros (4 digits)
    const countStr = (count + 1).toString().padStart(4, '0');
    
    // Format userId to 3 digits with leading zeros
    const userIdStr = userId.padStart(3, '0');

    // Combine all parts: YY + MM + userId + count
    return `${year}${month}${userIdStr}${countStr}`;
  }
} 