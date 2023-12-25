import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { CreateSellerProfileDto } from '../dtos/create-seller.dto';

import { SellerService } from '../services/seller.service';
import { SellerPicture } from '../module/sellerPicture.entity';
import { CreateSellerPictureDto } from '../dtos/sellerPicture.dto';

import { Seller } from '../module/sellerpersonal.entity';
import { SellerProfile } from '../module/seller.entity';
import { SessionGuard } from '../seller.guards';

@Controller('seller')
export class SellerProfileController {
  constructor(private readonly sellerService: SellerService) {}

  @Post('add')
  async createSellerWithProfile(
    @Body() data: { seller: Seller; sellerProfile: SellerProfile },
  ) {
    try {
      const { seller, sellerProfile } = data;

      const result = await this.sellerService.createSeller(
        seller,
        sellerProfile,
      );
      return {
        success: true,
        message: 'Seller and SellerProfile created successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Seller and SellerProfile creation failed',
        error: error.message,
      };
    }
  }

  @Get('hello')
  getHello(): string {
    return 'hello from Seller';
  }

  @Get('index')
  @UseGuards(SessionGuard)
  getIndex(@Session() session) {
    console.log(session.email);
    return this.sellerService.getAll();
  }

  @Get('allprofiledetails')
  @UseGuards(SessionGuard)
  getProfile(@Session() session) {
    console.log(session.email);
    console.log('Reached the getProfile route');
    console.log('Session email:', session.email);
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

  // @Post('login')
  // async login(
  //   @Body() createSellerProfileDto: CreateSellerProfileDto,
  //   @Session() session,
  // ) {
  //   const user = await this.sellerService.login(createSellerProfileDto);

  //   if (user) {
  //     session.email = createSellerProfileDto.sellerusername;
  //     return true;
  //   } else {
  //     console.log('Unauthorized login attempt');
  //     throw new HttpException('UnauthorizedException', HttpStatus.UNAUTHORIZED);
  //   }
  // }

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
    @Body() createSellerPictureDto: CreateSellerPictureDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SellerPicture> {
    if (!file) {
      throw new HttpException(
        'Profile picture is required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    createSellerPictureDto.sellerPicturename = file.filename;

    return this.sellerService.addSellerPicture(createSellerPictureDto);
  }
}
