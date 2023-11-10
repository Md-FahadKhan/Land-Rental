import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';

import { LandOwnerPicture } from '../module/landOwnerPicture.entity';
import { LandOwnerPictureService } from '../services/LandOwnerPicture.service';
// import { LandOwnerPictureService } from '../services/LandPicture.service';

@Controller('landpicture')
export class LandOwnerPictureController {
  // only for testing
  constructor(
    private readonly landOwnerProfileService: LandOwnerPictureService,
  ) {}

  @Post('upload/:id')
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
        destination: './Landpicture',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  async addLandPicture(
    @Param('id') ownerId: number,
    @Body() createLandOwnerPicture: LandOwnerPicture,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<LandOwnerPicture> {
    if (!file) {
      throw new HttpException(
        'Profile picture is required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    createLandOwnerPicture.landOwnerPicturename = file.filename;

    return this.landOwnerProfileService.addLandOwnerPicture(
      ownerId,
      createLandOwnerPicture,
    );
  }

  // chanage
  //   @Put('/changePicture')
  //   @UseInterceptors(
  //     FileInterceptor('DoctorPicture', {
  //       fileFilter: (req, file, cb) => {
  //         if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
  //           cb(null, true);
  //         } else {
  //           cb(new Error('LIMIT_UNEXPECTED_FILE'), false);
  //         }
  //       },
  //       limits: { fileSize: 300000 },
  //       storage: diskStorage({
  //         destination: './DoctorFiles',
  //         filename: (req, file, cb) => {
  //           const fileName = Date.now() + file.originalname;
  //           cb(null, fileName);
  //         },
  //       }),
  //     }),
  //   )
  //   async changePicture(
  //     @UploadedFile() file: Express.Multer.File,
  //   ): Promise<string> {
  //     const fileName = file.filename;
  //     return await this.landOwnerProfileService.changePicture(fileName);
  //   }

  //   @Get('/viewProfilePicture/:id')
  //   async getProfilePicture(@Param('id') id: number, @Res() res: Response) {
  //     const picture = await this.landOwnerProfileService.findPictureById(id);

  //     if (!picture) {
  //       throw new HttpException('Picture not found', HttpStatus.NOT_FOUND);
  //     }

  //     // Set the appropriate content type for the image
  //     res.setHeader('Content-Type', 'image/jpeg'); // Adjust the content type as per your file type

  //     // Stream the image file to the response
  //     const fileStream = this.landOwnerProfileService.getPictureStream(
  //       picture.landOwnerPicturename,
  //     );
  //     fileStream.pipe(res);
  //   }
}
