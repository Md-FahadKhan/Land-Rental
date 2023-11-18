import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSellerPictureDto } from '../dtos/sellerPicture.dto';
import { SellerPicture } from '../module/sellerpicture.entity';
import { SellerProfile } from '../module/seller.entity';

@Injectable()
export class SellerPictureService {
  // for testing
  constructor(
    @InjectRepository(SellerPicture)
    private sellerPictureRepository: Repository<SellerPicture>,
    @InjectRepository(SellerProfile)
    private sellerProfileReporsitory: Repository<SellerProfile>,
  ) {}
  async addSellerPicture(
    id: any,
    createSellerPictureDto: CreateSellerPictureDto,
  ): Promise<SellerPicture> {
    try {
      const sellerPicture = new SellerPicture();
      sellerPicture.sellerPicturename =
        createSellerPictureDto.sellerPicturename;

      const res = await this.sellerPictureRepository.save(sellerPicture);

      // Find a SellerProfile by its ID
      const profile = await this.sellerProfileReporsitory.findOne({
        where: { sellerid: id },
      });
      profile.sellerPicture = res;
      await this.sellerProfileReporsitory.save(profile);
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
  //     return this.landOwnerPictureRepository.findOne(sellerpictureid);
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
