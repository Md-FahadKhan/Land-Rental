import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerProfileController } from './Controllers/managerprofile.controller';
import { ManagerProfile } from './module/managerProfile.entity';
import { ManagerService } from './services/manager.service';
// Import the repository

@Module({
  imports: [TypeOrmModule.forFeature([ManagerProfile])],
  providers: [ManagerService],
  controllers: [ManagerProfileController],
  exports: [ManagerService],
})
export class ManagerModule {}
