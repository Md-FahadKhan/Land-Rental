import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateLandownerProfileDto } from '../dtos/create-landowner.dto';
import { LandownerProfile } from '../module/landowner.entity';
import { EmailService } from './landowneremail.service';

@Injectable()
export class LandownerService {
  emailService: any;
  constructor(
    @InjectRepository(LandownerProfile)
    private landownerProfileRepository: Repository<LandownerProfile>,
    emailService: EmailService, // @InjectRepository(ManagerEntity)
    // @InjectRepository(CategoryEntity)
    // private managerRepository: Repository<ManagerEntity>,
    // private categoryRepository: Repository<CategoryEntity>,
  ) // @InjectRepository(ProductEntity)
  // private productRepository: Repository<ProductEntity>,
  {}

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
        landownerid: true,
        landownername: true,
        landownertitle: true,
        landownerusername: true,
        landownerpassword: true,
      },
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
    existingProfile.landownerpassword = updatedProfile.landownerpassword;
    // Update other properties as needed

    // Save the updated profile in the database
    return await this.landownerProfileRepository.save(existingProfile);
  }
  getUserByID(id: number): Promise<LandownerProfile> {
    return this.landownerProfileRepository.findOneBy({ landownerid: id });
  }
  //   async addProductToCategory(
  //     productId: number,
  //     categoryId: number,
  //   ): Promise<any> {
  //     const product = await this.productRepository.findOne({
  //       where: { productId: productId },
  //     });

  //     const category = await this.categoryRepository.findOne({
  //       where: { categoryId: categoryId },
  //     });

  //     if (product && category) {
  //       if (!Array.isArray(product.categories)) {
  //         product.categories = []; // Initialize it as an empty array if not already an array.
  //       }

  //       product.categories = [...product.categories, category];
  //       await this.productRepository.save(product);
  //     } else {
  //       return { message: 'Product or category not found' };
  //     }
  //   }

  // adminRepository is the local repository
  async SellerRegistration(
    createLandownerProfileDto: CreateLandownerProfileDto,
  ): Promise<LandownerProfile> {
    const password = createLandownerProfileDto.landownerpassword;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    createLandownerProfileDto.landownerpassword = hashedPassword;

    // Save the new seller profile
    const res = await this.landownerProfileRepository.save(
      createLandownerProfileDto,
    );

    return res; // Return the newly created seller profile
  }

  // async login(adminInfo: CreateSellerProfileDto) {
  //   const admin = await this.sellerProfileRepository.findOneBy({
  //     sellerusername: adminInfo.sellerusername,
  //   });
  //   const result = await bcrypt.compare(
  //     adminInfo.sellerusername,
  //     admin.sellerusername,
  //   );
  //   if (result) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

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
        console.log('login successfulll');
        return user;
      }
    }

    console.log('Login failed. User not found or invalid password.');
    return null;
  }

  // async SellerRegistration(
  //   sellerProfile: SellerProfile,
  // ): Promise<SellerProfile[]> {
  //   const res = await this.sellerProfileRepository.save(sellerProfile);
  //   return res;
  // }
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
}
