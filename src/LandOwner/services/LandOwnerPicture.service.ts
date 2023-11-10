import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLandOwnerPictureDto } from '../dtos/landOwnerPicture.dto';
import { LandOwnerPicture } from '../module/landOwnerPicture.entity';

import { LandownerProfile } from '../module/landowner.entity';

@Injectable()
export class LandOwnerPictureService {
  // for testing
  constructor(
    @InjectRepository(LandOwnerPicture)
    private landOwnerPictureRepository: Repository<LandOwnerPicture>,
    @InjectRepository(LandownerProfile)
    private landOwnerProfileReporsitory: Repository<LandownerProfile>,
  ) {}
  async addLandOwnerPicture(
    id: any,
    createLandOwnerPictureDto: CreateLandOwnerPictureDto,
  ): Promise<LandOwnerPicture> {
    try {
      const landOwnerPicture = new LandOwnerPicture();
      landOwnerPicture.landOwnerPicturename =
        createLandOwnerPictureDto.landOwnerPicturename;

      const res = await this.landOwnerPictureRepository.save(landOwnerPicture);

      // Find a LandownerProfile by its ID
      const profile = await this.landOwnerProfileReporsitory.findOne({
        where: { landownerid: id },
      });
      profile.landOwnerPicture = res;
      await this.landOwnerProfileReporsitory.save(profile);
      return res;
    } catch (error) {
      console.error('Error while saving LandPicture:', error);
      throw new HttpException(
        'Failed to save LandPicture.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //change picture

  //   async changePicture(fileFullName: string): Promise<string> {
  //     try {
  //       // Update the picture with the new file name
  //       await this.landOwnerPictureRepository.update(
  //         {},
  //         { landOwnerPicturename: fileFullName },
  //       );

  //       // You can add additional logic here if needed, such as creating a notification

  //       return 'File uploaded successfully';
  //     } catch (error) {
  //       console.error('Error while changing picture:', error);
  //       throw new HttpException(
  //         'Failed to change picture.',
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }
  //   }

  //   async findPictureById(id: number): Promise<LandOwnerPicture> {
  //     return this.landOwnerPictureRepository.findOne(landownerpictureid);
  //   }

  //   async getPictureStream(fileName: string) {
  //     // Return a readable stream for the specified image file
  //     const fs = require('fs');
  //     const path = require('path');
  //     const filePath = path.join(__dirname, '..', 'Landpicture', fileName);

  //     if (fs.existsSync(filePath)) {
  //       return fs.createReadStream(filePath);
  //     }

  //     return null;
  //   }
}
