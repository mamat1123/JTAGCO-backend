import { IsNotEmpty, IsNumber } from 'class-validator';

export class TransferCompanyDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
