import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ManagerModule } from 'src/Manager/manager.module';
import { AuthStrategy } from './auth.strategy';

@Module({
  imports: [PassportModule, ManagerModule], // Import the ManagerModule here
  controllers: [],
  providers: [AuthStrategy],
  exports: [],
})
export class AuthModule {}
