import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Seller } from './sellerpersonal.entity';
import { SellerPicture } from './sellerpicture.entity';

@Entity('sellerProfile')
export class SellerProfile {
  @PrimaryGeneratedColumn()
  sellerid: number;
  @Column()
  sellername: string;
  @Column()
  sellertitle: string;
  @Column()
  sellerusername: string;
  @Column()
  sellerpassword: string;

  @OneToOne(
    () => SellerPicture,
    (sellerPicture) => sellerPicture.sellerProfile,
    { cascade: true },
  )
  @JoinColumn()
  sellerPicture: SellerPicture;

  @OneToOne(() => Seller, (seller) => seller.sellerProfile)
  seller: Seller;
}
