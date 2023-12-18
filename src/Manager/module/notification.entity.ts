import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ManagerE } from "./manager.entity";
import { Product } from "src/Products/module/product.entity";

@Entity("Manager_Notification")
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  Serial: number;

  @Column({ name: 'Message', type: "varchar", length: 150 })
  Message: string;
  @Column({ name: 'Date', type: "varchar", length: 150 })
  date: string;
  @Column({ name: 'Time', type: "varchar", length: 150 })
  time: string;

  @ManyToOne(() => ManagerE, manager => manager.notification)
  manager: ManagerE;
  @ManyToOne(() => Product, product => product.notification)
  product: Product;
}