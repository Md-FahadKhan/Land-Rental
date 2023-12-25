import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { join } from 'path';
import { Repository } from 'typeorm';
// import { CreateCategoryDto } from '../dtos/Create_Category_dto';
// import { CreateProductDto } from '../dtos/Create_Product_dto';
import { CreateManagerProfileDto } from '../dtos/create-manager.dto';
import { CreateManagerPictureDto } from '../dtos/managerPicture.dto';
// import { Category } from '../module/category.entity';
import { LandProfile } from 'src/LandOwner/module/addLand.entity';
import { CreateCategoryDto } from 'src/Products/dtos/Create_Category_dto';
import { CreateProductDto } from 'src/Products/dtos/Create_Product_dto';
import { Category } from 'src/Products/module/category.entity';
import { Product } from 'src/Products/module/product.entity';
import { ManagerPicture } from '../module/managerPicture.entity';
import { ManagerProfile } from '../module/managerProfile.entity';
import { Manager } from '../module/managerpersonal.entity';
// import { Product } from '../module/product.entity';
import * as nodemailer from 'nodemailer';
import { SellerProfile } from 'src/Seller/module/seller.entity';
import { ManagerE } from '../module/manager.entity';
// import { CreateAdminDto } from '../dtos/manager.dto';
import { NotificationEntity } from '../module/notification.entity';
import { CurrentDate, CurrentTime } from '../current.date';
@Injectable()
export class ManagerService {
  private transporter;
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
    @InjectRepository(LandProfile)
    private landProfileRepository: Repository<LandProfile>,
    @InjectRepository(SellerProfile)
    private sellerProfileRepository: Repository<SellerProfile>,
    @InjectRepository(NotificationEntity)
    private notificationRepo: Repository<NotificationEntity>,

    @InjectRepository(ManagerE)
    private adminRepository: Repository<ManagerE>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mdfahadkhan01701@gmail.com', // replace with your email
        pass: 'arkd nbjc fpsp lsrk', // replace with your email password or use app-specific password
      },
    });
  }


  // Add product

  // async viewNotification(email: string): Promise<NotificationEntity[]> {
  //   const manager = await this.adminRepository.findOne({ where: { email } })
  
  //   const notifications = await this.notificationRepo.find({
  //     where: {
  //       manager: manager,
  //     },
  //   });
  
  //   return notifications;
  // }
  async viewNotification(): Promise<NotificationEntity[]> {
    
  
    const notifications = await this.notificationRepo.find();
  
    return notifications;
  }
  async createAdmin(admin: ManagerE): Promise<ManagerE> {
    const password = admin.password;
    const confirmPassword = admin.confirmPassword;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedconfirmPassword = await bcrypt.hash(confirmPassword, salt);
    admin.confirmPassword = hashedconfirmPassword;
    admin.password = hashedPassword;
    const a = await this.adminRepository.save(admin);


    const notiFication: NotificationEntity = new NotificationEntity();
      notiFication.manager = a; 
      notiFication.Message = "Account Created Successfully";
      const currentDate: CurrentDate = new CurrentDate();
      const currentTime: CurrentTime = new CurrentTime();
  
      notiFication.date = currentDate.getCurrentDate();
      notiFication.time = currentTime.getCurrentTime();
      await this.notificationRepo.save(notiFication);


    return a;
  }

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'mdfahadkhan01701@gmail.com',
      to,
      subject,
      text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new HttpException(
        'Failed to send email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //

  async findAllBylandId(landId: number): Promise<LandProfile[]> {
    return this.landProfileRepository.find({
      where: { landid: landId },
    });
  }

  async getAllLand(): Promise<LandProfile[]> {
    return this.landProfileRepository.find();
  }
  //
  async addProduct(productInfo: Product): Promise<Product> {
    try {
      const savedProduct = await this.productRepository.save(productInfo);
  
      const noti: NotificationEntity = new NotificationEntity();
      noti.product = savedProduct;
      noti.Message = "1 Product Added";
      const currentDate: CurrentDate = new CurrentDate();
      const currentTime: CurrentTime = new CurrentTime();
  
      noti.date = currentDate.getCurrentDate();
      noti.time = currentTime.getCurrentTime();
  
      await this.notificationRepo.save(noti);
  
      return savedProduct;
    } catch (error) {
      console.error("Error adding product and creating notification:", error);
      throw new Error("Failed to add product and create notification");
    }
  }
  
  getAllProduct(): Promise<Product[]> {
    return this.productRepository.find();
  }
  getAllCategory(): Promise<Category[]> {
    return this.categoryRepository.find();
  }
  async findOneById(id: number): Promise<Product> {
    return this.productRepository.findOne({ where: { productId: id } });
  }
  async findOneByIdCategory(id: number): Promise<Category> {
    return this.categoryRepository.findOne({ where: { categoryId: id } });
  }

  async update(
    id: number,
    updateLandProfileDto: Partial<Product>,
  ): Promise<Product> {
    await this.productRepository.update(id, updateLandProfileDto);
    return this.findOneById(id);
  }
  async updateCategory(
    id: number,
    updateLandProfileDto: Partial<Category>,
  ): Promise<Category> {
    await this.categoryRepository.update(id, updateLandProfileDto);
    return this.findOneByIdCategory(id);
  }

  async removeProduct(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
  async removeNotification(Serial: number): Promise<void> {
    await this.notificationRepo.delete(Serial);
  }

  addCategory(categoryInfo: CreateCategoryDto) {
    return this.categoryRepository.save(categoryInfo);
  }
  async removeCategory(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
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
  // getProfile(): Promise<[SellerProfile]> {
  //   return this.sellerProfileRepository.find({
  //     select: {
  //       sellername: true,
  //       sellertitle: true,
  //       sellerusername: true,
  //       sellerpassword: true,
  //     },
  //   });
  // }
  async getAllSellerdetails(): Promise<SellerProfile[]> {
    return this.sellerProfileRepository.find();
  }
  // getProfile(): Promise<ManagerProfile[]> {
  //   return this.managerProfileRepository.find({
  //     select: {
  //       managername: true,
  //       managertitle: true,
  //       managerusername: true,
  //       managerpassword: true,
  //     },
  //   });
  // }
  async getProfileByEmail(email: string): Promise<ManagerE | null> {
    return this.adminRepository.findOne({
      where: { email : email },
    });
  }

  // async changePicture(email: string, FileFullName: string): Promise<string> {
  //   const manager = await this.adminRepository.findOne({ where: { email } });
  //   console.log(FileFullName);
  
  //   await this.adminRepository.update({ profilePic: manager }, { File: FileFullName });
  
    
  
  //   return 'File uploaded successfully';
  // }

  // here update the profile based on the id
  async updateProfile(
    id: number,
    updatedProfile: ManagerE,
  ): Promise<ManagerE | null> {
    const existingProfile = await this.adminRepository.findOne({
      where: { id: id },
    });

    if (!existingProfile) {
      throw new Error('Profile not found');
    }

    // Update the properties of the existing profile with the new values
    existingProfile.firstName = updatedProfile.firstName;
    existingProfile.phoneNumber = updatedProfile.phoneNumber;
    existingProfile.profilePic = updatedProfile.profilePic;
    

    // Check if the password is updated
    // if (updatedProfile.managerpassword) {
    //   const newPassword = updatedProfile.managerpassword;

    //   // Generate a new salt and hash the password
    //   const salt = await bcrypt.genSalt();
    //   const hashedPassword = await bcrypt.hash(newPassword, salt);

    //   // Update the password with the hashed password
    //   existingProfile.managerpassword = hashedPassword;
    // }

    // Update other properties as needed

    // Save the updated profile in the database
    return await this.adminRepository.save(existingProfile);
  }

  getUserByID(id: number): Promise<ManagerProfile> {
    return this.managerProfileRepository.findOneBy({ managerid: id });
  }
  //   async addProductToCategory(

  async login(
    createManagerProfileDto: ManagerE,
  ): Promise<ManagerE | null> {
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
  // async getImages(res: any) {
  //   try {
  //     // Assuming the file name is known or can be constructed based on some logic
  //     const fileName = 'pic.jpg'; // Replace with the actual file name
  
  //     const filePath = join(__dirname, '../../../upload/pic.jpg', fileName);
  
  //     res.sendFile(filePath, (err) => {
  //       if (err) {
  //         console.error('Error sending file:', err);
  //         return res.status(404).send('Missing Profile Picture');
  //       } else {
  //         console.log('File sent successfully:', fileName);
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error retrieving profile picture:', error);
  //     return res.status(500).send('Internal Server Error');
  //   }
  // }
//   async getimagebyadminid(adminid: number): Promise<string> {
//     const mydata: AdminDTO = await this.adminRepo.findOneBy({ id: adminid });
//     console.log(mydata);
//     return mydata.filenames;
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
