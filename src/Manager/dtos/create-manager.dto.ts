import { Product } from 'src/Products/module/product.entity';
import { ManagerProfile } from '../module/managerProfile.entity';
import { Manager } from '../module/managerpersonal.entity';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
// import { Product } from '../module/product.entity';

export class CreateManagerProfileDto {
  managerid: number;
  @IsString({ message: 'invalid name' })
  @Matches(/^[a-zA-Z]+$/, { message: 'enter a proper name' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Name cannot be longer than 50 characters' })
  managername: string;

  managertitle: string;
  managerusername: string;
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/, {
    message:
      'Password must be at least 8 characters, contain at least 1 special character, and have at least 1 capital letter',
  })
  managerpassword: string;
  manager: Manager;
}

export class CreateManagerDto {
  id: number;
  name: string;
  profile: ManagerProfile;
  manager: Manager;
  products: Product[];
}
