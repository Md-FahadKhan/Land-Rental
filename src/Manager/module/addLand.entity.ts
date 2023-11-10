import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Manager } from './managerpersonal.entity';

@Entity('ManagerAddLand')
export class AddLand {
  @PrimaryGeneratedColumn()
  landid: number;

  @Column()
  landname: string;

  @Column({ type: 'text', nullable: true }) // Add a description column
  description: string;

  @Column({ nullable: true }) // Add a location column
  location: string;

  @Column({ type: 'text', nullable: true }) // Add a size column
  size: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) // Add a price column
  price: number;

  @ManyToOne(() => Manager, (manager) => manager.addlands)
  manager: Manager;
}
