import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateEventSubTypeDto {
  @IsNumber()
  @IsNotEmpty()
  mainTypeId: number;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateEventSubTypeDto extends CreateEventSubTypeDto {}

export class EventSubTypeResponseDto {
  id: number;
  mainTypeId: number;
  code: string;
  name: string;
}
