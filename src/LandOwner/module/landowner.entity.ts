import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LandOwnerPicture } from './landOwnerPicture.entity';
import { Landowner } from './landownerpersonal.entity';
// import { AddLandPicture } from './addLandPicture.entity';

@Entity('landownerProfile')
export class LandownerProfile {
  @PrimaryGeneratedColumn()
  landownerid: number;

  @Column()
  landownername: string;

  @Column()
  landownertitle: string;

  @Column()
  landownerusername: string;

  @Column()
  landownerpassword: string;

  // @Column({ nullable: true })
  // landownerprofilepic: string;

  @OneToOne(
    () => LandOwnerPicture,
    (landOwnerPicture) => landOwnerPicture.landownerProfile,
    { cascade: true },
  )
  @JoinColumn()
  landOwnerPicture: LandOwnerPicture;

  @OneToOne(() => Landowner, (landowner) => landowner.landownerProfile)
  landowner: Landowner;
  //
  //
  //
}
