import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('landownerProfile')
export class LandownerProfile {
  @PrimaryGeneratedColumn()
  landownerid: number;
  @Column()
  landownername: string;
  @Column()
  landownertitle: string;
  @Column()
  landownerusername: string;
  @Column()
  landownerpassword: string;
  @Column()
  landownerprofilepicture: string;
}
