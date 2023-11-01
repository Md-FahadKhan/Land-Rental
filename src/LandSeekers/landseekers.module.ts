import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './module/landseeker.entity';
import { UserController } from './Controllers/landseekers.controller';
import { UserService } from './services/landseekers.service';


@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class LandSeekerModule {}