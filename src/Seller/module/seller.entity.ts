import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  @Column()
  sellerprofilepicture: string;
}
