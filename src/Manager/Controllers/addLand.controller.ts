import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AddLandDto } from '../dtos/addLand.dto';
import { AddLand } from '../module/addLand.entity';
import { LandService } from '../services/addLand.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';

@Controller('manager')
export class LandController {
  // only for testing
  constructor(private readonly landProfileService: LandService) {}

  @Get('/getlandimage/:name')
 getLandImages(@Param('name') name:string, @Res() res) {
 res.sendFile(name,{ root: './Landpictures' })
 }
  @Post('addland')
  @UseInterceptors(
    FileInterceptor('picture', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
          cb(null, true);
        else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 30000 },
      storage: diskStorage({
        destination: './LandPictures',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  create(
    @Body() createLandProfile: AddLand,
    @UploadedFile() file: Express.Multer.File,
  ):Promise<AddLand> {
    if (file) {
      createLandProfile.picture = file.filename;
    } else {
      // If no file was uploaded, set a default profile picture filename
      createLandProfile.picture = 'pic.jpg';
    }
    return this.landProfileService.create(createLandProfile);
  }

  // @Post(':managerId')
  // create(
  //   @Param('managerId') managerId: number,
  //   @Body() createLandProfileDto: AddLandDto,
  // ) {
  //   return this.landProfileService.create(managerId, createLandProfileDto);
  // }

  // @Get(':managerId')
  // findAllByOwnerId(@Param('managerId') managerId: number) {
  //   return this.landProfileService.findAllByOwnerId(managerId);
  // }

  @Get('getAllLandPost')
  async getAllLand(): Promise<{ success: boolean; data?: AddLand[] }> {
    try {
      const landpost = await this.landProfileService.findAllByOwnerId();
      return { success: true, data: landpost };
    } catch (error) {
      return { success: false };
    }
  }
  // @Get(':managerId')
  // findAllByOwnerId(@Param('managerId') managerId: number) {
  //   return this.landProfileService.findAllByOwnerId(managerId);
  // }


  @Get('/single/:id')
  findOne(@Param('id') id: number) {
    return this.landProfileService.findOneById(id);
  }

  @Put('/updateland/:id')
  update(
    @Param('id') id: number,
    @Body() updateLandProfileDto: Partial<AddLand>,
  ) {
    return this.landProfileService.update(id, updateLandProfileDto);
  }

  @Delete('/deleteland/:id')
  remove(@Param('id') id: number) {
    const delete1 = this.landProfileService.remove(id);
    if (delete1) {
      return { message: 'land deleted successfully' };
    } else {
      return { message: 'land id not found' };
    }
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
