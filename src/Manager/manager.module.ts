import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerController } from './controllers/manager.controller';
import { ManagerProfile } from './module/managerProfile.entity';
import { ManagerService } from './services/manager.service';
@Module({
  imports: [TypeOrmModule.forFeature([ManagerProfile])],
  controllers: [ManagerController],
  providers: [ManagerService],
  exports: [],
})
export class ManagerModule {}
