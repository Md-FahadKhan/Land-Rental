import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateSellerProfileDto } from '../dtos/create-seller.dto';
import { SellerProfile } from '../module/seller.entity';
@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerProfile)
    private sellerProfileRepository: Repository<SellerProfile>, // @InjectRepository(ManagerEntity)
    // @InjectRepository(CategoryEntity)
  ) // private managerRepository: Repository<ManagerEntity>,
  // private categoryRepository: Repository<CategoryEntity>,
  // @InjectRepository(ProductEntity)
  // private productRepository: Repository<ProductEntity>,
  {}

  getAll(): Promise<SellerProfile[]> {
    return this.sellerProfileRepository.find({
      select: {
        sellerusername: true,
        sellerpassword: true,
      },
    });
  }

  getUserByID(id: number): Promise<SellerProfile> {
    return this.sellerProfileRepository.findOneBy({ sellerid: id });
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
    createSellerProfileDto: CreateSellerProfileDto,
  ): Promise<SellerProfile> {
    const password = createSellerProfileDto.sellerpassword;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    createSellerProfileDto.sellerpassword = hashedPassword;

    // Save the new seller profile
    const res = await this.sellerProfileRepository.save(createSellerProfileDto);

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
    createSellerProfileDto: CreateSellerProfileDto,
  ): Promise<SellerProfile | null> {
    const user = await this.sellerProfileRepository.findOne({
      where: { sellerusername: createSellerProfileDto.sellerusername },
    });

    if (user) {
      const isPasswordValid = await bcrypt.compare(
        createSellerProfileDto.sellerpassword,
        user.sellerpassword,
      );

      if (isPasswordValid) {
        console.log('login successfulll');
        return user;
      }
    }

    console.log('Login failed. User not found or invalid password.');
    return null;
  }

  getProfile(): Promise<SellerProfile[]> {
    return this.sellerProfileRepository.find({
      select: {
        sellerid: true,
        sellername: true,
        sellertitle: true,
        sellerusername: true,
        sellerpassword: true,
      },
    });
  }

  // here update the profile based on the id
  async updateProfile(
    id: number,
    updatedProfile: SellerProfile,
  ): Promise<SellerProfile | null> {
    const existingProfile = await this.sellerProfileRepository.findOne({
      where: { sellerid: id },
    });

    if (!existingProfile) {
      throw new Error('Profile not found');
    }

    // Update the properties of the existing profile with the new values
    existingProfile.sellername = updatedProfile.sellername;
    existingProfile.sellertitle = updatedProfile.sellertitle;
    existingProfile.sellerusername = updatedProfile.sellerusername;
    existingProfile.sellerpassword = updatedProfile.sellerpassword;
    // Update other properties as needed

    // Save the updated profile in the database
    return await this.sellerProfileRepository.save(existingProfile);
  }
  async updateProfilePricture(
    id: number,
    updatedProfile: SellerProfile,
  ): Promise<SellerProfile | null> {
    const existingProfile = await this.sellerProfileRepository.findOne({
      where: { sellerid: id },
    });

    if (!existingProfile) {
      throw new Error('Profile not found');
    }
    // Update the properties of the existing profile with the new values
    existingProfile.sellerprofilepicture = updatedProfile.sellerprofilepicture;
    // Update other properties as needed
    // Save the updated profile in the database
    return await this.sellerProfileRepository.save(existingProfile);
  }
  // async SellerRegistration(
  //   sellerProfile: SellerProfile,
  // ): Promise<SellerProfile[]> {
  //   const res = await this.sellerProfileRepository.save(sellerProfile);
  //   return res;
  // }
  async getAllSeller(): Promise<SellerProfile[]> {
    return this.sellerProfileRepository.find();
  }
  async getSellerById(id: number): Promise<SellerProfile> {
    return this.sellerProfileRepository.findOneBy({ sellerid: id });
  }
}
