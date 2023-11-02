import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ManagerProfile } from 'src/Manager/module/managerProfile.entity';
import { ManagerService } from 'src/Manager/services/manager.service';
// Import the ManagerProfile entity

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly managerService: ManagerService) {
    super();
  }

  async validate(username: string, password: string): Promise<ManagerProfile> {
    const manager: ManagerProfile =
      await this.managerService.getManagerByUsername(username);
    if (!manager) {
      throw new UnauthorizedException();
    }
    if (manager.managerpassword === password) {
      return manager;
    } else {
      throw new UnauthorizedException();
    }
  }
}

//@Injectable()
// export class AuthStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly userService: UserService) {
//     super();
//   }
//   validate(username: string, password: string): User {
//     const user: User = this.userService.getUserByUserName(username);
//     if (user === undefined) throw new UnauthorizedException();
//     if (user != undefined && user.password == password) {
//       return user;
//     } else {
//       throw new UnauthorizedException();
//     }
//   }
// }
