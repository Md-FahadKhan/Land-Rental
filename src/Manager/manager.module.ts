import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerController } from './Controllers/manager.controller';
import { ManagerPictureController } from './Controllers/managerPicture.controller';
import { ManagerProfileController } from './Controllers/managerprofile.controller';
// import { Category } from './module/category.entity';
import { ManagerPicture } from './module/managerPicture.entity';
import { ManagerProfile } from './module/managerProfile.entity';
import { Manager } from './module/managerpersonal.entity';
// import { Product } from './module/product.entity';
import { LandProfile } from 'src/LandOwner/module/addLand.entity';
import { Category } from 'src/Products/module/category.entity';
import { Product } from 'src/Products/module/product.entity';
import { SellerProfile } from 'src/Seller/module/seller.entity';
import { LandController } from './Controllers/addLand.controller';
import { AddLand } from './module/addLand.entity';
import { LandService } from './services/addLand.service';
import { ManagerService } from './services/manager.service';
import { ManagerPictureService } from './services/managerPicture.service';
import { ManagerE } from './module/manager.entity';
import { ChatController } from './Controllers/chat.controller';
import { Message } from './module/message.entity';
import { NotificationEntity } from './module/notification.entity';

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
      LandProfile,
      SellerProfile,
      ManagerE,
      Message,
      NotificationEntity,
    ]),
  ],
  providers: [ManagerService, LandService, ManagerPictureService],
  controllers: [
    ManagerProfileController,
    ManagerController,
    ManagerPictureController,
    LandController,
    ChatController,
  ],
  exports: [ManagerService],
})
export class ManagerModule {}
