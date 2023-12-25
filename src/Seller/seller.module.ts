import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddLand } from 'src/Manager/module/addLand.entity';
import { Category } from 'src/Products/module/category.entity';
import { Product } from 'src/Products/module/product.entity';
import { SellerController } from './Controllers/seller.controller';
import { SellerPictureController } from './Controllers/sellerPicture.controller';
import { SellerProfileController } from './Controllers/sellerProfile.controller';
import { SellerProfile } from './module/seller.entity';
import { Seller } from './module/sellerpersonal.entity';
import { SellerPicture } from './module/sellerpicture.entity';
import { SellerService } from './services/seller.service';
import { SellerPictureService } from './services/sellerPicture.service';
import { SellerE } from './module/sellerr.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([SellerProfile])],
//   controllers: [SellerProfileController],
//   providers: [SellerService],
//   exports: [],
// })

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SellerProfile,
      Seller,
      SellerPicture,
      Product,
      Category,
      AddLand,
      SellerE
    ]),
  ],
  providers: [SellerService, SellerPictureService],
  controllers: [
    SellerProfileController,
    SellerController,
    SellerPictureController,
  ],
  exports: [SellerService],
})
export class SellerModule {}
