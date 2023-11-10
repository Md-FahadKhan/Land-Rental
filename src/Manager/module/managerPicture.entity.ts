import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ManagerProfile } from './managerProfile.entity';

@Entity('managerpicture')
export class ManagerPicture {
  @PrimaryGeneratedColumn()
  managerPictureid: number;

  @Column({ nullable: true })
  managerPicturename: string;

  @OneToOne(
    () => ManagerProfile,
    (managerProfile) => managerProfile.managerPicture,
  )
  managerProfile: ManagerProfile;
}
