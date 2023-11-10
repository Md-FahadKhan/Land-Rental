import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LandownerProfile } from './landowner.entity';

@Entity('landpicture')
export class LandOwnerPicture {
  @PrimaryGeneratedColumn()
  landOwnerPictureid: number;

  @Column({ nullable: true })
  landOwnerPicturename: string;

  @OneToOne(
    () => LandownerProfile,
    (landownerProfile) => landownerProfile.landOwnerPicture,
  )
  landownerProfile: LandownerProfile;
}
