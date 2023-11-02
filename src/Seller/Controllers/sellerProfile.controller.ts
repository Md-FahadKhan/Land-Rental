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

import { CreateSellerProfileDto } from '../dtos/create-seller.dto';
import { SellerProfile } from '../module/seller.entity';
import { SessionGuard } from '../seller.guards';
import { SellerService } from '../services/seller.service';

@Controller('seller')
export class SellerProfileController {
  constructor(private readonly sellerService: SellerService) {}

  @Get('hello')
  getHello(): string {
    return 'hello from admin';
  }

  @Get('index')
  @UseGuards(SessionGuard)
  getIndex(@Session() session) {
    console.log(session.email);
    return this.sellerService.getAll();
  }

  @Post('login')
  async login(
    @Body() createSellerProfileDto: CreateSellerProfileDto,
    @Session() session,
  ): Promise<boolean> {
    const user = await this.sellerService.login(createSellerProfileDto);

    if (user) {
      session.email = createSellerProfileDto.sellerusername;
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
    @Body() createsellerDto: CreateSellerProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SellerProfile> {
    createsellerDto.sellerprofilepicture = file.filename;
    const res = await this.sellerService.SellerRegistration(createsellerDto);
    return res;
  }

  @Get('profiledetails')
  @UseGuards(SessionGuard)
  getProfile(@Session() session) {
    console.log(session.email);
    return this.sellerService.getProfile();
  }

  @Put('update/:id') // Use a PUT request to update a profile by its ID
  @UseGuards(SessionGuard)
  async updateProfile(
    @Param('id') id: number,
    @Body() updatedProfile: SellerProfile,
  ) {
    try {
      const result = await this.sellerService.updateProfile(id, updatedProfile);
      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      return {
        success: false,
        message: 'Profile update failed',
        error: error.message,
      };
    }
  }

  @Put('updateprofilepicture/:id') // Use a PUT request to update a profile by its ID
  @UseGuards(SessionGuard)
  async updateProfilePricture(
    @Param('id') id: number,
    @Body() updatedProfile: SellerProfile,
  ) {
    try {
      const result = await this.sellerService.updateProfilePricture(
        id,
        updatedProfile,
      );
      return { success: true, message: 'Profile picture updated successfully' };
    } catch (error) {
      return {
        success: false,
        message: 'Profile picture update failed',
        error: error.message,
      };
    }
  }
}
