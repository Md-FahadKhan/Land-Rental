import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';

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
import { LandownerService } from '../services/landowner.service';
import { SessionGuard } from '../landowner.gaurds';
import { CreateLandownerProfileDto } from '../dtos/create-landowner.dto';
import { LandownerProfile } from '../module/landowner.entity';

@Controller('landowner')
export class LandownerProfileController {
  constructor(private readonly landownerService: LandownerService) {}

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
  ): Promise<boolean> {
    const user = await this.landownerService.login(createLandownerProfileDto);

    if (user) {
      session.email = createLandownerProfileDto.landownerusername;
      return true;
    } else {
      console.log('Unauthorized login attempt');
      throw new HttpException('UnauthorizedException', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('registration')
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
  async addSeller(
    @Body() createLandownerProfileDto: CreateLandownerProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<LandownerProfile> {
    createLandownerProfileDto.landownerprofilepicture = file.filename;
    const res = await this.landownerService.SellerRegistration(
      createLandownerProfileDto,
    );
    return res;
  }

  //
  //
  @Put('updatewithmail/:id')
  async updateProfileWithMail(
    @Param('id') id: number,
    @Body() updatedProfile: LandownerProfile,
  ): Promise<LandownerProfile | null> {
    return this.landownerService.updateProfilewithMial(id, updatedProfile);
  }
}
