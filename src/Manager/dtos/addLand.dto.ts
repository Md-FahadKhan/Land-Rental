// add-land.dto.ts

import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Manager } from '../module/managerpersonal.entity';

export class AddLandDto {
  @IsOptional()
  landid: number;
  @IsString({ message: 'invalid name' })
  @Matches(/^[a-zA-Z]+$/, { message: 'enter a proper name' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Name cannot be longer than 50 characters' })
  landname: string;

  @IsOptional()
  @IsString({ message: 'Invalid description' })
  description: string;

  @IsOptional()
  @IsString({ message: 'Invalid location' })
  location: string;

  @IsOptional()
  @IsString({ message: 'Invalid size' })
  size: string;

  @IsOptional()
  price: number;

  manager: Manager;
}
