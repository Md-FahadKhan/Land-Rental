import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  //   @Column()
  //   filename: string;
}
