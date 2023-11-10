import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LandController } from './Controllers/addLand.controller';
// import { LandOwnerPictureController, LandPictureController } from './Controllers/landPicture.controller';
import { LandowneController } from './Controllers/landowner.controller';
import { LandownerProfileController } from './Controllers/landownerProfile.controller';
import { LandProfile } from './module/addLand.entity';
import { EmailModule } from './module/email.module';
import { LandOwnerPicture } from './module/landOwnerPicture.entity';
import { LandownerProfile } from './module/landowner.entity';
import { Landowner } from './module/landownerpersonal.entity';
import { LandOwnerPictureService } from './services/LandOwnerPicture.service';
import { LandService } from './services/addLand.service';
import { LandownerService } from './services/landowner.service';
import { EmailService } from './services/landowneremail.service';
import { LandOwnerPictureController } from './Controllers/landPicture.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LandownerProfile,
      Landowner,
      LandProfile,
      LandOwnerPicture,
    ]),
    EmailModule,
  ],
  controllers: [
    LandownerProfileController,
    LandowneController,
    LandController,
    LandOwnerPictureController,
  ],
  providers: [
    LandownerService,
    EmailService,
    LandService,
    LandOwnerPictureService,
  ],
  exports: [],
})
export class LandownerModule {}
