import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { NotificationEntity } from './notification.entity';

@Entity()
export class ManagerE {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  confirmPassword: string;
  @Column()
  country: string;
  @Column()
  dateOfBirth: string;
  @Column()
  phoneNumber: number;
  @Column({ nullable: true })
  profilePic: string;

  @OneToMany(() => NotificationEntity, notification => notification.manager)
  notification: NotificationEntity[];
  

  //   @Column()
  //   filename: string;
}
