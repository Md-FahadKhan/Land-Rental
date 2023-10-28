import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerProfileController } from './Controllers/sellerProfile.controller';
import { SellerProfile } from './module/seller.entity';
import { SellerService } from './services/seller.service';

@Module({
  imports: [TypeOrmModule.forFeature([SellerProfile])],
  controllers: [SellerProfileController],
  providers: [SellerService],
  exports: [],
})
export class SellerModule {}
