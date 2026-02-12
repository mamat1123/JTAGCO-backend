import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class ReceiveShoeReturnDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  shoeRequestId: string;
}
