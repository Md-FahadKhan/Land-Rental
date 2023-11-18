import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AddLandDto } from '../dtos/addLand.dto';
import { AddLand } from '../module/addLand.entity';
import { LandService } from '../services/addLand.service';

@Controller('manageraddland')
export class LandController {
  // only for testing
  constructor(private readonly landProfileService: LandService) {}

  @Post(':managerId')
  create(
    @Param('managerId') managerId: number,
    @Body() createLandProfileDto: AddLandDto,
  ) {
    return this.landProfileService.create(managerId, createLandProfileDto);
  }

  @Get(':managerId')
  findAllByOwnerId(@Param('managerId') managerId: number) {
    return this.landProfileService.findAllByOwnerId(managerId);
  }

  @Get(':managerId/:id')
  findOne(@Param('id') id: number) {
    return this.landProfileService.findOneById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateLandProfileDto: Partial<AddLand>,
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
