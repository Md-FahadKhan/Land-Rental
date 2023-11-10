// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { AddLandPicture } from '../module/addLandPicture.entity';
// import { LandProfile } from '../module/addLand.entity';
// import { CreateLandPictureDto } from '../dtos/addLandPicture.dto';


// @Injectable()
// export class AddLandPictureService {
//   // for testing
//   constructor(
//     @InjectRepository(AddLandPicture)
//     private landPictureRepository: Repository<AddLandPicture>,
//     @InjectRepository(LandProfile)
//     private landProfileReporsitory: Repository<LandProfile>,
//   ) {}
//   async addLandPicture(
//     id: any,
//     createLandPictureDto: CreateLandPictureDto,
//   ): Promise<AddLandPicture> {
//     try {
//       const landPicture = new AddLandPicture();
//       landPicture.landPicturename =
//         createLandPictureDto.landPicturename;

//       const res = await this.landPictureRepository.save(landPicture);

//       // Find a LandProfile by its ID
//       const profile = await this.landProfileReporsitory.findOne({
//         where: { landid: id },
//       });
//       profile.landPicture = res;
//       await this.landProfileReporsitory.save(profile);
//       return res;
//     } catch (error) {
//       console.error('Error while saving LandPicture:', error);
//       throw new HttpException(
//         'Failed to save LandPicture.',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }
// }