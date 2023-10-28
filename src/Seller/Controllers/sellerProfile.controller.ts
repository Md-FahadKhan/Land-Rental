import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';

import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreateSellerProfileDto } from '../dtos/create-seller.dto';
import { SellerProfile } from '../module/seller.entity';
import { SellerService } from '../services/seller.service';

@Controller('seller')
export class SellerProfileController {
  constructor(private readonly sellerService: SellerService) {}

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
  addSeller(
    @Body() createsellerDto: CreateSellerProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SellerProfile> {
    createsellerDto.sellerprofilepicture = file.filename;
    return this.sellerService.SellerRegistration(createsellerDto);
  }
}

// @Controller('registration')
// export class SellerProfileController {
//   constructor(private readonly sellerService: SellerService) {}

//   @Post()
//   @UsePipes(new ValidationPipe())
//   @UseInterceptors(
//     FileInterceptor('profilepic', {
//       fileFilter: (req, file, cb) => {
//         if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
//           cb(null, true);
//         } else {
//           cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
//         }
//       },
//       limits: { fileSize: 30000 },
//       storage: diskStorage({
//         destination: './upload',
//         filename: function (req, file, cb) {
//           cb(null, Date.now() + file.originalname);
//         },
//       }),
//     }),
//   )
//   addSeller(
//     @Body() sellerProfile: SellerProfile,
//     @UploadedFile() file: Express.Multer.File,
//   ) {
//     // Here, sellerProfile contains your form data, and file contains the uploaded file.
//     // You can access them as needed and pass them to your service.

//     // Example usage:
//     const data = {
//       sellerProfile,
//       file, // This is the uploaded file
//     };

//     return this.sellerService.addSeller(data);
//   }
//}
