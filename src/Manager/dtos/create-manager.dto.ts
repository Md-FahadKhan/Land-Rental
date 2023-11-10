import { ManagerProfile } from '../module/managerProfile.entity';
import { Manager } from '../module/managerpersonal.entity';
import { Product } from '../module/product.entity';

export class CreateManagerProfileDto {
  // id: number;
  // name: string;
  // email: string;
  // password: string; // Assuming this is not a validated field
  // filename: string;
  //  admin: AdminEntity;
  //  managers: ManagerEntity[];

  managerid: number;
  managername: string;
  managertitle: string;
  managerusername: string;
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
