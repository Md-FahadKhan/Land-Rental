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
import { ManagerPicture } from '../module/managerPicture.entity';
import { ManagerPictureService } from '../services/managerPicture.service';

@Controller('manager')
export class ManagerPictureController {
  // only for testing
  constructor(private readonly managerProfileService: ManagerPictureService) {}

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
        destination: './Managerpicture',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  async addManagerPicture(
    @Param('id') ownerId: number,
    @Body() createManagerPicture: ManagerPicture,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ManagerPicture> {
    if (!file) {
      throw new HttpException(
        'Profile picture is required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    createManagerPicture.managerPicturename = file.filename;

    return this.managerProfileService.addManagerPicture(
      ownerId,
      createManagerPicture,
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
