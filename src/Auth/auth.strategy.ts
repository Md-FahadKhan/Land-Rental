import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './../User/user.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/User/user.entity';
@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super();
  }
  validate(username: string, password: string): User {
    const user: User = this.userService.getUserByUserName(username);
    if (user === undefined) throw new UnauthorizedException();
    if (user != undefined && user.password == password) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
