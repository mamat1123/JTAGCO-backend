import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../shared/services/supabase.service';
import { BusinessTypeDto } from './dto/business-type.dto';

@Injectable()
export class BusinessTypesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(token: string): Promise<BusinessTypeDto[]> {
    const supabase = await this.supabaseService.getUserClient(token);

    const { data, error } = await supabase
      .from('business_types')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return data as BusinessTypeDto[];
  }
}
