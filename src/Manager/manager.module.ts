import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerController } from './Controllers/manager.controller';
import { ManagerPictureController } from './Controllers/managerPicture.controller';
import { ManagerProfileController } from './Controllers/managerprofile.controller';
import { Category } from './module/category.entity';
import { ManagerPicture } from './module/managerPicture.entity';
import { ManagerProfile } from './module/managerProfile.entity';
import { Manager } from './module/managerpersonal.entity';
import { Product } from './module/product.entity';
import { ManagerService } from './services/manager.service';
import { ManagerPictureService } from './services/managerPicture.service';
import { AddLand } from './module/addLand.entity';
import { LandService } from './services/addLand.service';
import { LandController } from './Controllers/addLand.controller';

// Import the repository

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ManagerProfile,
      Manager,
      ManagerPicture,
      Product,
      Category,
      AddLand,
    ]),
  ],
  providers: [ManagerService, LandService, ManagerPictureService],
  controllers: [
    ManagerProfileController,
    ManagerController,
    ManagerPictureController,
    LandController,
  ],
  exports: [ManagerService],
})
export class ManagerModule {}
