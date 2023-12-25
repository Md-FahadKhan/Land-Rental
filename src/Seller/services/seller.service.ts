import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { CreateCategoryDto } from 'src/Products/dtos/Create_Category_dto';
import { CreateProductDto } from 'src/Products/dtos/Create_Product_dto';
import { Category } from 'src/Products/module/category.entity';
import { Product } from 'src/Products/module/product.entity';

import { CreateSellerProfileDto } from '../dtos/create-seller.dto';
import { CreateSellerPictureDto } from '../dtos/sellerPicture.dto';
import { SellerProfile } from '../module/seller.entity';
import { Seller } from '../module/sellerpersonal.entity';
import { SellerPicture } from '../module/sellerpicture.entity';
import { SellerE } from '../module/sellerr.entity';
@Injectable()
export class SellerService {
  private transporter;
  constructor(
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
    @InjectRepository(SellerProfile)
    private sellerProfileRepository: Repository<SellerProfile>,
    @InjectRepository(SellerPicture)
    private sellerPictureRepository: Repository<SellerPicture>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(SellerE)
    private adminRepository: Repository<SellerE>,
  ) {}

  async create(admin: SellerE): Promise<SellerE> {
    const password = admin.password;
    const confirmPassword = admin.confirmPassword;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedconfirmPassword = await bcrypt.hash(confirmPassword, salt);
    admin.confirmPassword = hashedconfirmPassword;
    admin.password = hashedPassword;
    const a = await this.adminRepository.save(admin);


    // const notiFication: NotificationEntity = new NotificationEntity();
    //   notiFication.manager = a; 
    //   notiFication.Message = "Account Created Successfully";
    //   const currentDate: CurrentDate = new CurrentDate();
    //   const currentTime: CurrentTime = new CurrentTime();
  
    //   notiFication.date = currentDate.getCurrentDate();
    //   notiFication.time = currentTime.getCurrentTime();
    //   await this.notificationRepo.save(notiFication);


    return a;
  }

  addProduct(productInfo: CreateProductDto) {
    return this.productRepository.save(productInfo);
  }
  getAllProduct(): Promise<Product[]> {
    return this.productRepository.find();
  }
  async findOneById(id: number): Promise<Product> {
    return this.productRepository.findOne({ where: { productId: id } });
  }

  async update(
    id: number,
    updateLandProfileDto: Partial<Product>,
  ): Promise<Product> {
    await this.productRepository.update(id, updateLandProfileDto);
    return this.findOneById(id);
  }

  async removeProduct(id: number): Promise<void> {
    await this.productRepository.delete(id);
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

  //Create Seller
  //
  //
  //

  async createSeller(
    seller: Seller,
    sellerProfile: SellerProfile,
  ): Promise<SellerProfile> {
    seller.sellerProfile = sellerProfile; // Set the association

    const password = sellerProfile.sellerpassword;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    sellerProfile.sellerpassword = hashedPassword;

    await this.sellerRepository.save(seller);

    return this.sellerProfileRepository.save(sellerProfile);
  }

  getAll(): Promise<SellerProfile[]> {
    return this.sellerProfileRepository.find({
      select: {
        sellerusername: true,
        sellerpassword: true,
      },
    });
  }
  getProfile(): Promise<SellerProfile[]> {
    return this.sellerProfileRepository.find({
      select: {
        sellername: true,
        sellertitle: true,
        sellerusername: true,
        sellerpassword: true,
      },
    });
  }
  async getProfileByEmail(email: string): Promise<SellerProfile | null> {
    return this.sellerProfileRepository.findOne({
      where: { sellerusername: email },
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

    // Check if the password is updated
    if (updatedProfile.sellerpassword) {
      const newPassword = updatedProfile.sellerpassword;

      // Generate a new salt and hash the password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update the password with the hashed password
      existingProfile.sellerpassword = hashedPassword;
    }

    // Update other properties as needed

    // Save the updated profile in the database
    return await this.sellerProfileRepository.save(existingProfile);
  }

  getUserByID(id: number): Promise<SellerProfile> {
    return this.sellerProfileRepository.findOneBy({ sellerid: id });
  }
  //   async addProductToCategory(


  async login(
    createManagerProfileDto: SellerE,
  ): Promise<SellerE | null> {
    const user = await this.adminRepository.findOne({
      where: { email: createManagerProfileDto.email },
    });

    if (user) {
      const isPasswordValid = await bcrypt.compare(
        createManagerProfileDto.password as string,
        user.password as string,
      );

      if (isPasswordValid) {
        console.log('Login successful');
        return user;
      }
    }

    console.log('Login failed. User not found or invalid password.');
    return null;
  }


  // async login(
  //   createSellerProfileDto: CreateSellerProfileDto,
  // ): Promise<SellerProfile | null> {
  //   const user = await this.sellerProfileRepository.findOne({
  //     where: { sellerusername: createSellerProfileDto.sellerusername },
  //   });

  //   if (user) {
  //     const isPasswordValid = await bcrypt.compare(
  //       createSellerProfileDto.sellerpassword,
  //       user.sellerpassword,
  //     );

  //     if (isPasswordValid) {
  //       console.log('Login successful');
  //       return user;
  //     }
  //   }

  //   console.log('Login failed. User not found or invalid password.');
  //   return null;
  // }

  async getAllSeller(): Promise<SellerProfile[]> {
    return this.sellerProfileRepository.find();
  }
  async getSellerById(id: number): Promise<SellerProfile> {
    return this.sellerProfileRepository.findOneBy({ sellerid: id });
  }

  //
  //
  // async updateProfilewithMial(
  //   id: number,
  //   updatedProfile: SellerProfile,
  // ): Promise<SellerProfile | null> {
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

  async addSellerPicture(
    createLandPictureDto: CreateSellerPictureDto,
  ): Promise<SellerPicture> {
    try {
      const sellerPicture = new SellerPicture();
      sellerPicture.sellerPicturename = createLandPictureDto.sellerPicturename;
      const res = await this.sellerPictureRepository.save(sellerPicture);
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

//
//

// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import * as bcrypt from 'bcrypt';
// import { Repository } from 'typeorm';
// import { CreateSellerProfileDto } from '../dtos/create-seller.dto';
// import { SellerProfile } from '../module/seller.entity';
// @Injectable()
// export class SellerService {
//   constructor(
//     @InjectRepository(SellerProfile)
//     private sellerProfileRepository: Repository<SellerProfile>, // @InjectRepository(SellerEntity)
//     // @InjectRepository(CategoryEntity)
//   ) // private sellerRepository: Repository<ManagerEntity>,
//   // private categoryRepository: Repository<CategoryEntity>,
//   // @InjectRepository(ProductEntity)
//   // private productRepository: Repository<ProductEntity>,
//   {}

//   getAll(): Promise<SellerProfile[]> {
//     return this.sellerProfileRepository.find({
//       select: {
//         sellerusername: true,
//         sellerpassword: true,
//       },
//     });
//   }

//   getUserByID(id: number): Promise<SellerProfile> {
//     return this.sellerProfileRepository.findOneBy({ sellerid: id });
//   }
//   //   async addProductToCategory(
//   //     productId: number,
//   //     categoryId: number,
//   //   ): Promise<any> {
//   //     const product = await this.productRepository.findOne({
//   //       where: { productId: productId },
//   //     });

//   //     const category = await this.categoryRepository.findOne({
//   //       where: { categoryId: categoryId },
//   //     });

//   //     if (product && category) {
//   //       if (!Array.isArray(product.categories)) {
//   //         product.categories = []; // Initialize it as an empty array if not already an array.
//   //       }

//   //       product.categories = [...product.categories, category];
//   //       await this.productRepository.save(product);
//   //     } else {
//   //       return { message: 'Product or category not found' };
//   //     }
//   //   }

//   // adminRepository is the local repository
//   async SellerRegistration(
//     createSellerProfileDto: CreateSellerProfileDto,
//   ): Promise<SellerProfile> {
//     const password = createSellerProfileDto.sellerpassword;
//     const salt = await bcrypt.genSalt();
//     const hashedPassword = await bcrypt.hash(password, salt);
//     createSellerProfileDto.sellerpassword = hashedPassword;

//     // Save the new seller profile
//     const res = await this.sellerProfileRepository.save(createSellerProfileDto);

//     return res; // Return the newly created seller profile
//   }

//   // async login(adminInfo: CreateSellerProfileDto) {
//   //   const admin = await this.sellerProfileRepository.findOneBy({
//   //     sellerusername: adminInfo.sellerusername,
//   //   });
//   //   const result = await bcrypt.compare(
//   //     adminInfo.sellerusername,
//   //     admin.sellerusername,
//   //   );
//   //   if (result) {
//   //     return true;
//   //   } else {
//   //     return false;
//   //   }
//   // }

//   async login(
//     createSellerProfileDto: CreateSellerProfileDto,
//   ): Promise<SellerProfile | null> {
//     const user = await this.sellerProfileRepository.findOne({
//       where: { sellerusername: createSellerProfileDto.sellerusername },
//     });

//     if (user) {
//       const isPasswordValid = await bcrypt.compare(
//         createSellerProfileDto.sellerpassword,
//         user.sellerpassword,
//       );

//       if (isPasswordValid) {
//         console.log('login successfulll');
//         return user;
//       }
//     }

//     console.log('Login failed. User not found or invalid password.');
//     return null;
//   }

//   getProfile(): Promise<SellerProfile[]> {
//     return this.sellerProfileRepository.find({
//       select: {
//         sellerid: true,
//         sellername: true,
//         sellertitle: true,
//         sellerusername: true,
//         sellerpassword: true,
//       },
//     });
//   }

//   // here update the profile based on the id
//   async updateProfile(
//     id: number,
//     updatedProfile: SellerProfile,
//   ): Promise<SellerProfile | null> {
//     const existingProfile = await this.sellerProfileRepository.findOne({
//       where: { sellerid: id },
//     });

//     if (!existingProfile) {
//       throw new Error('Profile not found');
//     }

//     // Update the properties of the existing profile with the new values
//     existingProfile.sellername = updatedProfile.sellername;
//     existingProfile.sellertitle = updatedProfile.sellertitle;
//     existingProfile.sellerusername = updatedProfile.sellerusername;
//     existingProfile.sellerpassword = updatedProfile.sellerpassword;
//     // Update other properties as needed

//     // Save the updated profile in the database
//     return await this.sellerProfileRepository.save(existingProfile);
//   }
//   async updateProfilePricture(
//     id: number,
//     updatedProfile: SellerProfile,
//   ): Promise<SellerProfile | null> {
//     const existingProfile = await this.sellerProfileRepository.findOne({
//       where: { sellerid: id },
//     });

//     if (!existingProfile) {
//       throw new Error('Profile not found');
//     }
//     // Update the properties of the existing profile with the new values
//     existingProfile.sellerprofilepicture = updatedProfile.sellerprofilepicture;
//     // Update other properties as needed
//     // Save the updated profile in the database
//     return await this.sellerProfileRepository.save(existingProfile);
//   }
//   // async SellerRegistration(
//   //   sellerProfile: SellerProfile,
//   // ): Promise<SellerProfile[]> {
//   //   const res = await this.sellerProfileRepository.save(sellerProfile);
//   //   return res;
//   // }
//   async getAllSeller(): Promise<SellerProfile[]> {
//     return this.sellerProfileRepository.find();
//   }
//   async getSellerById(id: number): Promise<SellerProfile> {
//     return this.sellerProfileRepository.findOneBy({ sellerid: id });
//   }
// }
