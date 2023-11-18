import { Product } from "src/Products/module/product.entity";
import { SellerProfile } from "../module/seller.entity";
import { Seller } from "../module/sellerpersonal.entity";

export class CreateSellerProfileDto {
  //  admin: AdminEntity;
  //  managers: ManagerEntity[];

  sellerid: number;
  sellername: string;
  sellertitle: string;
  sellerusername: string;
  sellerpassword: string;
  seller: Seller;
}
export class CreateSellerDto {
  id: number;
  name: string;
  profile: SellerProfile;
  seller: Seller;
  products: Product[];
}
