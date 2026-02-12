import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../../shared/services/supabase.service';

@Injectable()
export class CompanyIdService {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Generates a company ID with the following format:
   * YY + MM + UU + CCCC
   * Where:
   * YY = Buddhist year (2 digits)
   * MM = Month (2 digits)
   * UU = User ID from profiles table (2 digits)
   * CCCC = Company count for the user in current month (4 digits)
   */
  async generateCompanyId(token: string, profileId: string): Promise<string> {
    const now = new Date();

    // Get Buddhist year (current year + 543)
    const buddhistYear = (now.getFullYear() + 543).toString().slice(-2);

    // Get month with leading zero
    const month = (now.getMonth() + 1).toString().padStart(2, '0');

    // Use the profile ID, padded to 2 digits
    const formattedUserId = profileId.padStart(2, '0');

    // Get authenticated client for RLS
    const client = await this.supabaseService.getUserClient(token);

    // Get the count of companies for this user in the current month
    try {
      console.log(
        'Querying companies with pattern:',
        `${buddhistYear}${month}${formattedUserId}%`,
      );
      const { data, error } = await client
        .from('companies')
        .select('id')
        .like('id', `${buddhistYear}${month}${formattedUserId}%`)
        .order('id', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          query: `${buddhistYear}${month}${formattedUserId}%`,
        });
        throw new Error(`Failed to count companies: ${error.message}`);
      }
      let sequenceNumber = 1;
      if (data && data.length > 0) {
        const lastId = data[0].id;
        const lastSeq = parseInt(lastId.slice(-4), 10); // get last 4 digits
        sequenceNumber = lastSeq + 1;
      }
      // Format the count with leading zeros (4 digits)
      const countStr = sequenceNumber.toString().padStart(4, '0');

      // Combine all parts: YY + MM + UU + CCCC
      const companyId = `${buddhistYear}${month}${formattedUserId}${countStr}`;
      console.log('Generated company ID:', companyId);
      return companyId;
    } catch (error) {
      console.error('Error in generateCompanyId:', error);
      throw error;
    }
  }
}
