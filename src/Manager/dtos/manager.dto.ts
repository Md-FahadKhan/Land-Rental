import { ManagerE } from "../module/manager.entity";


export class CreateAdminDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword:string;
  country:string;
  dateOfBirth:string;
  phoneNumber:number; // Assuming this is not a validated field
//   filename: string;
  admin: ManagerE;
}
