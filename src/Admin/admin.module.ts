import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './module/admin.entity';
import { AdminService } from './services/admin.service';
import { AdminController } from './Controllers/admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}