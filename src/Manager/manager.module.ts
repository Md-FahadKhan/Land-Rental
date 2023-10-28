import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ManagerProfile } from './module/managerProfile.entity';
import { ManagerService } from './services/manager.service';
import { ManagerProfileController } from './Controllers/managerprofile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ManagerProfile])],
  controllers: [ManagerProfileController],
  providers: [ManagerService],
  exports: [],
})
export class ManagerModule {}
