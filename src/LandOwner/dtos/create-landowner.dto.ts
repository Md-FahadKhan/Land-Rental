import { LandownerProfile } from '../module/landowner.entity';
import { Landowner } from '../module/landownerpersonal.entity';

export class CreateLandownerProfileDto {
  //  admin: AdminEntity;
  //  managers: ManagerEntity[];

  landownerid: number;
  landownername: string;
  landownertitle: string;
  landownerusername: string;
  landownerpassword: string;

  landowner: Landowner;
}
export class CreateLandownerDto {
  id: number;
  name: string;
  profile: LandownerProfile;
}
