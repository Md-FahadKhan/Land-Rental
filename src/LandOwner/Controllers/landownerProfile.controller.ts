import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { CreateLandownerProfileDto } from '../dtos/create-landowner.dto';
import { CreateLandOwnerPictureDto } from '../dtos/landOwnerPicture.dto';
import { SessionGuard } from '../landowner.gaurds';
import { LandOwnerPicture } from '../module/landOwnerPicture.entity';
import { LandownerProfile } from '../module/landowner.entity';
import { Landowner } from '../module/landownerpersonal.entity';
import { LandownerService } from '../services/landowner.service';

@Controller('landowner')
export class LandownerProfileController {
  constructor(private readonly landownerService: LandownerService) {}

  @Post('Registration')
  async createLandownerWithProfile(
    @Body() data: { landowner: Landowner; landownerProfile: LandownerProfile },
  ) {
    try {
      const { landowner, landownerProfile } = data;
      // const name = landowner.name;
      // const username = landownerProfile.landownerusername;
      // const landownertitle = landownerProfile.landownertitle;
      // const landownername = landownerProfile.landownername;
      // const landownerpassword = landownerProfile.landownerpassword;
      // const landownerprofilepic = landownerProfile.landownerprofilepic;

      const result = await this.landownerService.createLandowner(
        landowner,
        landownerProfile,
      );
      return {
        success: true,
        message: 'Landowner and LandownerProfile created successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Landowner and LandownerProfile creation failed',
        error: error.message,
      };
    }
  }

  @Get('hello')
  getHello(): string {
    return 'hello from admin';
  }

  @Get('index')
  @UseGuards(SessionGuard)
  getIndex(@Session() session) {
    console.log(session.email);
    return this.landownerService.getAll();
  }

  @Get('profiledetails')
  @UseGuards(SessionGuard)
  getProfile(@Session() session) {
    console.log(session.email);
    console.log('Reached the getProfile route');
    console.log('Session email:', session.email);
    return this.landownerService.getProfile();
  }

  @Put('update/:id') // Use a PUT request to update a profile by its ID
  @UseGuards(SessionGuard)
  async updateProfile(
    @Param('id') id: number,
    @Body() updatedProfile: LandownerProfile,
  ) {
    try {
      const result = await this.landownerService.updateProfile(
        id,
        updatedProfile,
      );
      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      return {
        success: false,
        message: 'Profile update failed',
        error: error.message,
      };
    }
  }

  @Post('login')
  async login(
    @Body() createLandownerProfileDto: CreateLandownerProfileDto,
    @Session() session,
  ) {
    const user = await this.landownerService.login(createLandownerProfileDto);

    if (user) {
      session.email = createLandownerProfileDto.landownerusername;
      return true;
    } else {
      console.log('Unauthorized login attempt');
      throw new HttpException('UnauthorizedException', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('picture')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor('profilepic', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
          cb(null, true);
        else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 30000 },
      storage: diskStorage({
        destination: './upload',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  async addLandPicture(
    @Body() createLandOwnerPictureDto: CreateLandOwnerPictureDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<LandOwnerPicture> {
    if (!file) {
      throw new HttpException(
        'Profile picture is required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    createLandOwnerPictureDto.landOwnerPicturename = file.filename;

    return this.landownerService.addLandOwnerPicture(createLandOwnerPictureDto);
  }
}
