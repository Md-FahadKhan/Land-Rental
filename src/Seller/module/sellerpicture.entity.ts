import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SellerProfile } from './seller.entity';

@Entity('sellerpicture')
export class SellerPicture {
  @PrimaryGeneratedColumn()
  sellerPictureid: number;

  @Column({ nullable: true })
  sellerPicturename: string;

  @OneToOne(() => SellerProfile, (sellerProfile) => sellerProfile.sellerPicture)
  sellerProfile: SellerProfile;
}
