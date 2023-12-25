import { SellerE } from "../module/sellerr.entity";
export class CreateSellerDto {
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
  
    profilePic: string;
  
    admin: SellerE;
  }