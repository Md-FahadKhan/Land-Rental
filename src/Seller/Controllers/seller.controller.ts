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
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SellerService } from 'src/Seller/services/seller.service';
// import { CreateProductDto } from '../dtos/Create_Product_dto';
import { CreateCategoryDto } from 'src/Products/dtos/Create_Category_dto';
import { CreateProductDto } from 'src/Products/dtos/Create_Product_dto';
import { Product } from 'src/Products/module/product.entity';
import { SessionGuard } from '../seller.guards';
import { CreateSellerProfileDto } from '../dtos/create-seller.dto';
import { SellerE } from '../module/sellerr.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { CreateSellerDto } from "../dtos/Seller.dto"

interface Category {
  categoryId: number;
  name: String;
}
@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post('addseller')
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
        destination: './SellerProfilePicture',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  async addSeller(
    @Body() createAdminDto: SellerE,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SellerE> {
    // Check if a file was uploaded
    
    if (file) {
      createAdminDto.profilePic = file.filename;
    } else {
      // If no file was uploaded, set a default profile picture filename
      createAdminDto.profilePic = 'pic.jpg';
    }
  
    return this.sellerService.create(createAdminDto);
  }

  @Post('addProduct')
  @UseGuards(SessionGuard)
  createProduct(@Body() product: CreateProductDto): Promise<Product> {
    return this.sellerService.addProduct(product);
  }
  @Get('getAllProduct')
  async getAllProducts(): Promise<{ success: boolean; data?: Product[] }> {
    try {
      const products = await this.sellerService.getAllProduct();
      return { success: true, data: products };
    } catch (error) {
      return { success: false };
    }
  }
  @Get('singleProduct/:id')
  findOne(@Param('id') id: number) {
    return this.sellerService.findOneById(id);
  }

  @Put('updateProduct/:id')
  update(
    @Param('id') id: number,
    @Body() updateLandProfileDto: Partial<Product>,
  ) {
    return this.sellerService.update(id, updateLandProfileDto);
  }

  @Delete('deleteProduct:id')
  remove(@Param('id') id: number) {
    return this.sellerService.removeProduct(id);
  }

  @Post('addCategory')
  createCategory(@Body() category: CreateCategoryDto): Promise<Category> {
    return this.sellerService.addCategory(category);
  }

  @Post('productcategory')
  async addProductToCategory(
    @Body() body: { productId: number; categoryId: number },
  ): Promise<any> {
    const { productId, categoryId } = body;

    const product = await this.sellerService.addProductToCategory(
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

  @Get('hello')
  getHello(): string {
    return 'hello from admin';
  }
  @Get('profile')
  @UseGuards(SessionGuard)
  async getProfile(@Session() session) {
    if (session && session.email) {
      const profile = await this.sellerService.getProfileByEmail(session.email);

      if (profile) {
        return profile;
      } else {
        throw new NotFoundException('Profile not found');
      }
    } else {
      throw new ForbiddenException('Forbidden resource');
    }
  }

  @Post('loginseller')
  async login(
    @Body() CreateSellerDto: SellerE,
    @Session() session,
  ) {
    const user = await this.sellerService.login(CreateSellerDto);

    if (user) {
      session.email = CreateSellerDto.email;
      return true;
    } else {
      console.log('Unauthorized login attempt');
      throw new HttpException('UnauthorizedException', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('index')
  @UseGuards(SessionGuard)
  getIndex(@Session() session) {
    console.log(session.email);
    return this.sellerService.getAll();
  }
  // @Post('login')
  // async login(
  //   @Body() createSellerProfileDto: CreateSellerProfileDto,
  //   @Session() session,
  // ) {
  //   const user = await this.sellerService.login(createSellerProfileDto);

  //   if (user) {
  //     session.email = createSellerProfileDto.sellerusername; // Set the email in the session

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
