import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManagerProfile } from '../module/managerProfile.entity';
import { ManagerPicture } from '../module/managerPicture.entity';
import { CreateManagerPictureDto } from '../dtos/managerPicture.dto';

@Injectable()
export class ManagerPictureService {
  // for testing
  constructor(
    @InjectRepository(ManagerPicture)
    private managerPictureRepository: Repository<ManagerPicture>,
    @InjectRepository(ManagerProfile)
    private managerProfileReporsitory: Repository<ManagerProfile>,
  ) {}
  async addManagerPicture(
    id: any,
    createManagerPictureDto: CreateManagerPictureDto,
  ): Promise<ManagerPicture> {
    try {
      const managerPicture = new ManagerPicture();
      managerPicture.managerPicturename =
        createManagerPictureDto.managerPicturename;

      const res = await this.managerPictureRepository.save(managerPicture);

      // Find a ManagerProfile by its ID
      const profile = await this.managerProfileReporsitory.findOne({
        where: { managerid: id },
      });
      profile.managerPicture = res;
      await this.managerProfileReporsitory.save(profile);
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
  //     return this.landOwnerPictureRepository.findOne(managerpictureid);
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
