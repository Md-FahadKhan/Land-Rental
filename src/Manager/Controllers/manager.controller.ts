import { SessionGuard } from './../../LandOwner/landowner.gaurds';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  
} from '@nestjs/common';
import { ManagerService } from 'src/Manager/services/manager.service';
// import { CreateProductDto } from '../dtos/Create_Product_dto';
import { CreateCategoryDto } from 'src/Products/dtos/Create_Category_dto';
import { CreateProductDto } from 'src/Products/dtos/Create_Product_dto';
import { Product } from 'src/Products/module/product.entity';
import { CreateManagerProfileDto } from '../dtos/create-manager.dto';

// import { ManagerService } from '../services/manager.service';
import { LandProfile } from 'src/LandOwner/module/addLand.entity';
// import { CreateAdminDto } from '../dtos/manager.dto';
import { ManagerE } from '../module/manager.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { join } from 'path';
import { NotificationEntity } from '../module/notification.entity';

// import { CreateCategoryDto } from '../dtos/Create_Category_dto';
// import { Product } from '../module/product.entity';

interface Category {
  categoryId: number;
  name: String;
}
@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  ///
  // @Get('/viewProfilePicture')
  // getImages(@Res() res) {
  //   return this.managerService.getImages(res);
  // }
  

  @Get('/getimage/:name')
 getImages(@Param('name') name:string, @Res() res) {
 res.sendFile(name,{ root: './upload' })
 }

 @Get('/getproductimage/:name')
 getProductImages(@Param('name') name:string, @Res() res) {
 res.sendFile(name,{ root: './ProductImages' })
 }
 


  @Post('add')
@UsePipes(new ValidationPipe())
@UseInterceptors(
  FileInterceptor('profilepic', {
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
        cb(null, true);
      else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      }
    },
    limits: { fileSize: 30000 },
    storage: diskStorage({
      destination: './ManagerProfilePicture',
      filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
      },
    }),
  }),
)
async addManager(
  @Body() createAdminDto: ManagerE,
  @UploadedFile() file: Express.Multer.File,
): Promise<ManagerE> {
  // Check if a file was uploaded
  
  if (file) {
    createAdminDto.profilePic = file.filename;
  } else {
    // If no file was uploaded, set a default profile picture filename
    createAdminDto.profilePic = 'pic.jpg';
  }

  return this.managerService.createAdmin(createAdminDto);
}

 @Get('/notification')
 
  viewNotification(): Promise<NotificationEntity[]> {
    return this.managerService.viewNotification();
  }

  @Delete('deleteNotification/:id')
  removeNoti(@Param('id') Serial: number) {
    const delete1 = this.managerService.removeNotification(Serial);
    if (delete1) {
      return { message: 'Notification deleted successfully' };
    } else {
      return { message: 'Notification id not found' };
    }
  }
//  @Get('/notification')
//  @UseGuards(SessionGuard)
//   viewNotification(@Session() session): Promise<NotificationEntity[]> {
//     return this.managerService.viewNotification(session.email);
//   }
// @Put('/changePicture')
// @UseGuards(SessionGuard)
// @UseInterceptors(
//   FileInterceptor('profilepic', {
//     fileFilter: (req, file, cb) => {
//       if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
//         cb(null, true);
//       } else {
//         cb(new Error('LIMIT_UNEXPECTED_FILE'), false);
//       }
//     },
//     limits: { fileSize: 300000 },
//     storage: diskStorage({
//       destination: './ManagerProfilePicture',
//       filename: (req, file, cb) => {
//         const fileName = Date.now() + file.originalname;
//         cb(null, fileName);
//       },
//     }),
//   }),
// )
// async changePicture(
//   @UploadedFile() file: Express.Multer.File,
//   @Session() session,
// ): Promise<string> {
//   const fileName = file.filename;
//   return await this.managerService.changePicture(session.email, fileName);
// }

  //

  @Post('sendEmail')
  async sendEmail(
    @Body() emailData: { to: string; subject: string; text: string },
  ): Promise<any> {
    try {
      await this.managerService.sendEmail(
        emailData.to,
        emailData.subject,
        emailData.text,
      );

      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to send email' };
    }
  }

  //
  @Get('allseller')
  // @UseGuards(SessionGuard)
  getSellerProfiledetails(@Session() session) {
    return this.managerService.getAllSellerdetails();
  }
  //

  @Get('seeAllLandOwnerPost')
  async getAllLand(): Promise<{
    success: boolean;
    message?: string;
    data?: LandProfile[];
  }> {
    try {
      const landProfiles = await this.managerService.getAllLand();
      return {
        success: true,
        data: landProfiles,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve land profiles',
      };
    }
  }

  @Get('selectland/:landId')
  findAllByOwnerId(@Param('landId') landId: number) {
    return this.managerService.findAllBylandId(landId);
  }
  //
  //
@Post('addProduct')
  // @UseGuards(SessionGuard)UsePipes(new ValidationPipe())
@UseInterceptors(
  FileInterceptor('picture', {
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
        cb(null, true);
      else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      }
    },
    limits: { fileSize: 30000 },
    storage: diskStorage({
      destination: './ProductImages',
      filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
      },
    }),
  }),
)
  createProduct(@Body() product: Product,
  @UploadedFile() file: Express.Multer.File,
  ): Promise<Product> {
    if (file) {
      product.picture = file.filename;
    } else {
      // If no file was uploaded, set a default profile picture filename
      product.picture = 'pic.jpg';
    }
    return this.managerService.addProduct(product);
  }
  @Get('getAllProduct')
  async getAllProducts(): Promise<{ success: boolean; data?: Product[] }> {
    try {
      const products = await this.managerService.getAllProduct();
      return { success: true, data: products };
    } catch (error) {
      return { success: false };
    }
  }
  @Get('getAllCategory')
  async getAllCategory(): Promise<{ success: boolean; data?: Category[] }> {
    try {
      const category = await this.managerService.getAllCategory();
      return { success: true, data: category };
    } catch (error) {
      return { success: false };
    }
  }
  @Get('singleProduct/:id')
  findOne(@Param('id') id: number) {
    return this.managerService.findOneById(id);
  }
  @Get('singleCategory/:id')
  findOneCategory(@Param('id') id: number) {
    return this.managerService.findOneByIdCategory(id);
  }

  @Put('updateProduct/:id')
  update(
    @Param('id') id: number,
    @Body() updateLandProfileDto: Partial<Product>,
  ) {
    return this.managerService.update(id, updateLandProfileDto);
  }

  @Delete('deleteProduct/:id')
  remove(@Param('id') id: number) {
    const delete1 = this.managerService.removeProduct(id);
    if (delete1) {
      return { message: 'Product deleted successfully' };
    } else {
      return { message: 'Product id not found' };
    }
  }
  @Delete('deleteProduct/:id')
  removeCategory(@Param('id') id: number) {
    const delete1 = this.managerService.removeCategory(id);
    if (delete1) {
      return { message: 'Category deleted successfully' };
    } else {
      return { message: 'Category id not found' };
    }
  }

  @Post('addCategory')
  createCategory(@Body() category: CreateCategoryDto): Promise<Category> {
    console.log('Received category:', category);
    return this.managerService.addCategory(category);
  }
  
  

  

  @Post('productcategory')
  async addProductToCategory(
    @Body() body: { productId: number; categoryId: number },
  ): Promise<any> {
    const { productId, categoryId } = body;

    const product = await this.managerService.addProductToCategory(
      productId,
      categoryId,
    );
    if (product) {
      return { message: 'Product added to category successfully' };
    } else {
      return { message: 'Product or category not found' };
    }
  }

  //Login
  //
  //
  //
  @UseGuards(SessionGuard)
  @Get('hellomanager')
  getHello(@Session() session): Record<string, any> {
    return {
      user: 'Welcome ' + session.email, // This includes the user details in the response
    };
  }
  @Get('profile')
  @UseGuards(SessionGuard)
  async getProfile(@Session() session) {
    if (session && session.email) {
      const profile = await this.managerService.getProfileByEmail(
        session.email,
      );

      if (profile) {
        return profile;
      } else {
        throw new NotFoundException('Profile not found');
      }
    } else {
      throw new ForbiddenException('Forbidden resource');
    }
  }

  @Get('index')
  @UseGuards(SessionGuard)
  getIndex(@Session() session) {
    console.log(session.email);
    return this.managerService.getAll();
  }

  // @Post('login')
  // async login(
  //   @Body() createManagerProfileDto: CreateManagerProfileDto,
  //   @Session() session,
  // ) {
  //   const user = await this.managerService.login(createManagerProfileDto);

  //   if (user) {
  //     session.email = createManagerProfileDto.managerusername; // Set the email in the session

  //     return {
  //       success: true,
  //       message: 'Login successful',
  //       user: user, // This includes the user details in the response
  //     };
  //   } else {
  //     console.log('Unauthorized login attempt');
  //     throw new HttpException('UnauthorizedException', HttpStatus.UNAUTHORIZED);
  //   }
  // }
}
