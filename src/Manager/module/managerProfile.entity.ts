import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  @Column()
  managerprofilepicture: string;
}
