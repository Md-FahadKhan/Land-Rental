// import {
//   Body,
//   Controller,
//   HttpException,
//   HttpStatus,
//   Param,
//   Post,
//   UploadedFile,
//   UseInterceptors,
//   UsePipes,
//   ValidationPipe,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { MulterError, diskStorage } from 'multer';

// import { LandOwnerPicture } from '../module/landOwnerPicture.entity';
// import { LandOwnerPictureService } from '../services/LandOwnerPicture.service';

// @Controller('landpicture')
// export class AddLandPictureController {
//   // only for testing
//   constructor(
//     private readonly landOwnerProfileService: LandOwnerPictureService,
//   ) {}

//   @Post('upload/:id')
//   @UsePipes(new ValidationPipe())
//   @UseInterceptors(
//     FileInterceptor('profilepic', {
//       fileFilter: (req, file, cb) => {
//         if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
//           cb(null, true);
//         else {
//           cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
//         }
//       },
//       limits: { fileSize: 30000 },
//       storage: diskStorage({
//         destination: './Landpicture',
//         filename: function (req, file, cb) {
//           cb(null, Date.now() + file.originalname);
//         },
//       }),
//     }),
//   )
//   async addLandPicture(
//     @Param('id') ownerId: number,
//     @Body() createLandOwnerPicture: LandOwnerPicture,
//     @UploadedFile() file: Express.Multer.File,
//   ): Promise<LandOwnerPicture> {
//     if (!file) {
//       throw new HttpException(
//         'Profile picture is required.',
//         HttpStatus.BAD_REQUEST,
//       );
//     }

//     createLandOwnerPicture.landOwnerPicturename = file.filename;

//     return this.landOwnerProfileService.addLandOwnerPicture(
//       ownerId,
//       createLandOwnerPicture,
//     );
//   }
// }
