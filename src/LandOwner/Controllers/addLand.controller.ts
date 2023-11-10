import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';

import { LandProfile } from '../module/addLand.entity';

import { LandService } from './../services/addLand.service';

@Controller('land')
export class LandController {
  // only for testing
  constructor(private readonly landProfileService: LandService) {}

  @Post(':ownerId')
  create(
    @Param('ownerId') ownerId: number,
    @Body() createLandProfileDto: Partial<LandProfile>,
  ) {
    return this.landProfileService.create(ownerId, createLandProfileDto);
  }

  @Get(':ownerId')
  findAllByOwnerId(@Param('ownerId') ownerId: number) {
    return this.landProfileService.findAllByOwnerId(ownerId);
  }

  @Get(':ownerId/:id')
  findOne(@Param('id') id: number) {
    return this.landProfileService.findOneById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateLandProfileDto: Partial<LandProfile>,
  ) {
    return this.landProfileService.update(id, updateLandProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.landProfileService.remove(id);
  }

  //   constructor(private readonly landService: LandService) {}

  //   @Post('add')
  //   async addland(@Body() addLandProfileDto: AddLandProfileDto) {
  //     try {
  //       const result = await this.landService.addLand(addLandProfileDto);
  //       return {
  //         success: true,
  //         message: 'Landowner and LandownerProfile created successfully',
  //         data: result,
  //       };
  //     } catch (error) {
  //       return {
  //         success: false,
  //         message: 'Landowner and LandownerProfile creation failed',
  //         error: error.message,
  //       };
  //     }
  //   }

  //   @Get('hello')
  //   getHello(): string {
  //     return 'hello from land';
  //   }
  //   @Get('profiledetails')
  //   @UseGuards(SessionGuard)
  //   getProfile1(@Session() session) {
  //     console.log(session.email);
  //     return this.landService.getProfile();
  //   }
  //   @Get('profile')
  //   @UseGuards(SessionGuard)
  //   async getProfile(@Session() session) {
  //     if (session && session.email) {
  //       const profile = await this.landService.getProfileByEmail(session.email);

  //       if (profile) {
  //         return profile;
  //       } else {
  //         throw new NotFoundException('Profile not found');
  //       }
  //     } else {
  //       throw new ForbiddenException('Forbidden resource');
  //     }
  //   }

  //   @Get('index')
  //   @UseGuards(SessionGuard)
  //   getIndex(@Session() session) {
  //     console.log(session.email);
  //     return this.landService.getAll();
  //   }
}
