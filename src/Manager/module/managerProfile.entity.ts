
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ManagerPicture } from './managerPicture.entity';
import { Manager } from './managerpersonal.entity';

@Entity('managerProfile')
export class ManagerProfile {
  @PrimaryGeneratedColumn()
  managerid: number;
  @Column()
  managername: string;
  @Column()
  managertitle: string;
  @Column()
  managerusername: string;
  @Column()
  managerpassword: string;

  @OneToOne(
    () => ManagerPicture,
    (managerPicture) => managerPicture.managerProfile,
    { cascade: true },
  )
  @JoinColumn()
  managerPicture: ManagerPicture;

  @OneToOne(() => Manager, (manager) => manager.managerProfile)
  manager: Manager;
}
