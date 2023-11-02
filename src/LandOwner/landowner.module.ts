import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LandownerProfileController } from './Controllers/landownerProfile.controller';
import { EmailModule } from './module/email.module';
import { LandownerProfile } from './module/landowner.entity';
import { LandownerService } from './services/landowner.service';
import { EmailService } from './services/landowneremail.service';
import { LandowneController } from './Controllers/landowner.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LandownerProfile]), EmailModule],
  controllers: [LandownerProfileController, LandowneController],
  providers: [LandownerService, EmailService],
  exports: [],
})
export class LandownerModule {}
