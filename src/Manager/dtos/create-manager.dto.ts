

export class CreateManagerProfileDto {
  id: number;
  name: string;
  email: string;
  password: string; // Assuming this is not a validated field
  filename: string;
//   admin: AdminEntity;
//   managers: ManagerEntity[];
}
