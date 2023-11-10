import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LandownerProfile } from './landowner.entity';
import { LandProfile } from './addLand.entity';

@Entity('landowner')
export class Landowner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => LandProfile, (landProfile) => landProfile.owner)
  landProfiles: LandProfile[];
  // Define the one-to-one relationship with LandownerProfile
  @OneToOne(
    () => LandownerProfile,
    (landownerProfile) => landownerProfile.landowner,
    { cascade: true },
  )
  @JoinColumn()
  landownerProfile: LandownerProfile;
  static landownerProfile: typeof LandownerProfile;
}
