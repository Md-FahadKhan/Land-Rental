import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// import { Product } from './product.entity';
import { Product } from 'src/Products/module/product.entity';
import { SellerProfile } from './seller.entity';

@Entity('Seller')
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  // admin with manager relation
  // @ManyToOne(() => Admin, (admin) => admin.addmanager)
  // admin: Admin;
  //other relation

  @OneToMany(() => Product, (product) => product.seller, { cascade: true })
  prodcuts: Product[];

  @OneToOne(() => SellerProfile, (sellerProfile) => sellerProfile.seller, {
    cascade: true,
  })
  @JoinColumn()
  sellerProfile: SellerProfile;
  static sellerProfile: typeof SellerProfile;
}
