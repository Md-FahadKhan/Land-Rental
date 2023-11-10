import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dtos/Create_Category_dto';
import { CreateProductDto } from '../dtos/Create_Product_dto';
import { CreateManagerProfileDto } from '../dtos/create-manager.dto';
import { CreateManagerPictureDto } from '../dtos/managerPicture.dto';
import { Category } from '../module/category.entity';
import { ManagerPicture } from '../module/managerPicture.entity';
import { ManagerProfile } from '../module/managerProfile.entity';
import { Manager } from '../module/managerpersonal.entity';
import { Product } from '../module/product.entity';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,
    @InjectRepository(ManagerProfile)
    private managerProfileRepository: Repository<ManagerProfile>,
    @InjectRepository(ManagerPicture)
    private managerPictureRepository: Repository<ManagerPicture>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  // Add product
  //
  //
  addProduct(productInfo: CreateProductDto) {
    return this.productRepository.save(productInfo);
  }

  addCategory(categoryInfo: CreateCategoryDto) {
    return this.categoryRepository.save(categoryInfo);
  }

  async addProductToCategory(
    productId: number,
    categoryId: number,
  ): Promise<Product | { message: string }> {
    const product = await this.productRepository.findOne({
      where: { productId: productId },
    });

    const category = await this.categoryRepository.findOne({
      where: { categoryId: categoryId },
    });

    if (product && category) {
      if (!Array.isArray(product.categories)) {
        product.categories = [];
      }

      product.categories = [...product.categories, category];
      await this.productRepository.save(product);
      return product;
    } else {
      return { message: 'Product or category not found' };
    }
  }

  //Create Manager
  //
  //
  //

  async createManager(
    manager: Manager,
    managerProfile: ManagerProfile,
  ): Promise<ManagerProfile> {
    manager.managerProfile = managerProfile; // Set the association

    const password = managerProfile.managerpassword;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    managerProfile.managerpassword = hashedPassword;

    await this.managerRepository.save(manager);

    return this.managerProfileRepository.save(managerProfile);
  }

  getAll(): Promise<ManagerProfile[]> {
    return this.managerProfileRepository.find({
      select: {
        managerusername: true,
        managerpassword: true,
      },
    });
  }
  getProfile(): Promise<ManagerProfile[]> {
    return this.managerProfileRepository.find({
      select: {
        managername: true,
        managertitle: true,
        managerusername: true,
        managerpassword: true,
      },
    });
  }
  async getProfileByEmail(email: string): Promise<ManagerProfile | null> {
    return this.managerProfileRepository.findOne({
      where: { managerusername: email },
    });
  }

  // here update the profile based on the id
  async updateProfile(
    id: number,
    updatedProfile: ManagerProfile,
  ): Promise<ManagerProfile | null> {
    const existingProfile = await this.managerProfileRepository.findOne({
      where: { managerid: id },
    });

    if (!existingProfile) {
      throw new Error('Profile not found');
    }

    // Update the properties of the existing profile with the new values
    existingProfile.managername = updatedProfile.managername;
    existingProfile.managertitle = updatedProfile.managertitle;
    existingProfile.managerusername = updatedProfile.managerusername;

    // Check if the password is updated
    if (updatedProfile.managerpassword) {
      const newPassword = updatedProfile.managerpassword;

      // Generate a new salt and hash the password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update the password with the hashed password
      existingProfile.managerpassword = hashedPassword;
    }

    // Update other properties as needed

    // Save the updated profile in the database
    return await this.managerProfileRepository.save(existingProfile);
  }

  getUserByID(id: number): Promise<ManagerProfile> {
    return this.managerProfileRepository.findOneBy({ managerid: id });
  }
  //   async addProductToCategory(

  async login(
    createManagerProfileDto: CreateManagerProfileDto,
  ): Promise<ManagerProfile | null> {
    const user = await this.managerProfileRepository.findOne({
      where: { managerusername: createManagerProfileDto.managerusername },
    });

    if (user) {
      const isPasswordValid = await bcrypt.compare(
        createManagerProfileDto.managerpassword,
        user.managerpassword,
      );

      if (isPasswordValid) {
        console.log('Login successful');
        return user;
      }
    }

    console.log('Login failed. User not found or invalid password.');
    return null;
  }

  async getAllSeller(): Promise<ManagerProfile[]> {
    return this.managerProfileRepository.find();
  }
  async getSellerById(id: number): Promise<ManagerProfile> {
    return this.managerProfileRepository.findOneBy({ managerid: id });
  }

  //
  //
  // async updateProfilewithMial(
  //   id: number,
  //   updatedProfile: ManagerProfile,
  // ): Promise<ManagerProfile | null> {
  //   // Update the profile as before

  //   // Send an email notification
  //   const profileUpdatedMessage = `Profile with ID ${id} has been updated.`;
  //   await this.emailService.sendEmail(
  //     'mdfahadkhan01701@gmail.com',
  //     'Profile Updated',
  //     profileUpdatedMessage,
  //   );

  //   return updatedProfile;
  // }

  async addManagerPicture(
    createLandPictureDto: CreateManagerPictureDto,
  ): Promise<ManagerPicture> {
    try {
      const managerPicture = new ManagerPicture();
      managerPicture.managerPicturename =
        createLandPictureDto.managerPicturename;
      const res = await this.managerPictureRepository.save(managerPicture);
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
