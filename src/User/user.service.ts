import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
@Injectable()
export class UserService {
  public users: User[] = [
    {
      username: 'fahad',
      password: 'fahad',
      email: 'abc@gmail.com',
    },
    {
      username: 'fahadevan',
      password: 'fahad',
      email: 'bbb@gmail.com',
    },
    {
      username: 'fahadkhan',
      password: 'fahad',
      email: 'ccc@gmail.com',
    },
  ];
  getUserByUserName(userName: string): User | undefined {
    return this.users.find((user: User) => user.username === userName);
  }
}
