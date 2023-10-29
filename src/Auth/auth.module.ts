import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/User/user.module';
import { AuthStrategy } from './auth.strategy';
// import { UserService } from './user.service';

@Module({
  imports: [PassportModule, UserModule],
  controllers: [],
  providers: [AuthStrategy],
  exports: [],
})
export class AuthModule {}
