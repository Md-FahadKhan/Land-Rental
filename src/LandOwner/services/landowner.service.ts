import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateLandownerProfileDto } from '../dtos/create-landowner.dto';
import { CreateLandOwnerPictureDto } from '../dtos/landOwnerPicture.dto';
import { LandOwnerPicture } from '../module/landOwnerPicture.entity';
import { LandownerProfile } from '../module/landowner.entity';
import { Landowner } from '../module/landownerpersonal.entity';

@Injectable()
export class LandownerService {
  emailService: any;
  constructor(
    @InjectRepository(Landowner)
    private landownerRepository: Repository<Landowner>,
    @InjectRepository(LandownerProfile)
    private landownerProfileRepository: Repository<LandownerProfile>,
    @InjectRepository(LandOwnerPicture)
    private landOwnerPictureRepository: Repository<LandOwnerPicture>, // @InjectRepository(ProductEntity)
  ) {}

  async createLandowner(
    landowner: Landowner,
    landownerProfile: LandownerProfile,
  ): Promise<LandownerProfile> {
    landowner.landownerProfile = landownerProfile; // Set the association

    const password = landownerProfile.landownerpassword;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    landownerProfile.landownerpassword = hashedPassword;

    await this.landownerRepository.save(landowner);

    return this.landownerProfileRepository.save(landownerProfile);
  }

  getAll(): Promise<LandownerProfile[]> {
    return this.landownerProfileRepository.find({
      select: {
        landownerusername: true,
        landownerpassword: true,
      },
    });
  }
  getProfile(): Promise<LandownerProfile[]> {
    return this.landownerProfileRepository.find({
      select: {
        landownername: true,
        landownertitle: true,
        landownerusername: true,
        landownerpassword: true,
      },
    });
  }
  async getProfileByEmail(email: string): Promise<LandownerProfile | null> {
    return this.landownerProfileRepository.findOne({
      where: { landownerusername: email },
    });
  }

  // here update the profile based on the id
  async updateProfile(
    id: number,
    updatedProfile: LandownerProfile,
  ): Promise<LandownerProfile | null> {
    const existingProfile = await this.landownerProfileRepository.findOne({
      where: { landownerid: id },
    });

    if (!existingProfile) {
      throw new Error('Profile not found');
    }

    // Update the properties of the existing profile with the new values
    existingProfile.landownername = updatedProfile.landownername;
    existingProfile.landownertitle = updatedProfile.landownertitle;
    existingProfile.landownerusername = updatedProfile.landownerusername;

    // Check if the password is updated
    if (updatedProfile.landownerpassword) {
      const newPassword = updatedProfile.landownerpassword;

      // Generate a new salt and hash the password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update the password with the hashed password
      existingProfile.landownerpassword = hashedPassword;
    }

    // Update other properties as needed

    // Save the updated profile in the database
    return await this.landownerProfileRepository.save(existingProfile);
  }

  getUserByID(id: number): Promise<LandownerProfile> {
    return this.landownerProfileRepository.findOneBy({ landownerid: id });
  }
  //   async addProductToCategory(

  async login(
    createLandownerProfileDto: CreateLandownerProfileDto,
  ): Promise<LandownerProfile | null> {
    const user = await this.landownerProfileRepository.findOne({
      where: { landownerusername: createLandownerProfileDto.landownerusername },
    });

    if (user) {
      const isPasswordValid = await bcrypt.compare(
        createLandownerProfileDto.landownerpassword,
        user.landownerpassword,
      );

      if (isPasswordValid) {
        console.log('Login successful');
        return user;
      }
    }

    console.log('Login failed. User not found or invalid password.');
    return null;
  }

  async getAllSeller(): Promise<LandownerProfile[]> {
    return this.landownerProfileRepository.find();
  }
  async getSellerById(id: number): Promise<LandownerProfile> {
    return this.landownerProfileRepository.findOneBy({ landownerid: id });
  }

  //
  //
  async updateProfilewithMial(
    id: number,
    updatedProfile: LandownerProfile,
  ): Promise<LandownerProfile | null> {
    // Update the profile as before

    // Send an email notification
    const profileUpdatedMessage = `Profile with ID ${id} has been updated.`;
    await this.emailService.sendEmail(
      'mdfahadkhan01701@gmail.com',
      'Profile Updated',
      profileUpdatedMessage,
    );

    return updatedProfile;
  }

  async addLandOwnerPicture(
    createLandPictureDto: CreateLandOwnerPictureDto,
  ): Promise<LandOwnerPicture> {
    try {
      const landOwnerPicture = new LandOwnerPicture();
      landOwnerPicture.landOwnerPicturename =
        createLandPictureDto.landOwnerPicturename;
      const res = await this.landOwnerPictureRepository.save(landOwnerPicture);
      return res;
    } catch (error) {
      console.error('Error while saving LandPicture:', error);
      throw new HttpException(
        'Failed to save LandPicture.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
