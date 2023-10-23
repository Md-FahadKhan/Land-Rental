import { Module } from '@nestjs/common';
import { ManagerContorller } from './controllers/manager.controller';
import { ManagerService } from './services/manager.service';
@Module({
  imports: [],
  controllers: [ManagerContorller],
  providers: [ManagerService],
  exports: [],
})
export class ManagerModule {}
