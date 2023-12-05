
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @IsNotEmpty()
  @Column()
  name: string;
  @Column()
  price:string;


  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
