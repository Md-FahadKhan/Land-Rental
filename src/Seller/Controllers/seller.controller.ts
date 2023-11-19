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
  UseGuards,
} from '@nestjs/common';
import { SellerService } from 'src/Seller/services/seller.service';
// import { CreateProductDto } from '../dtos/Create_Product_dto';
import { CreateCategoryDto } from 'src/Products/dtos/Create_Category_dto';
import { CreateProductDto } from 'src/Products/dtos/Create_Product_dto';
import { Product } from 'src/Products/module/product.entity';
import { SessionGuard } from '../seller.guards';
import { CreateSellerProfileDto } from '../dtos/create-seller.dto';

interface Category {
  categoryId: number;
  name: String;
}
@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

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

  @Get('index')
  @UseGuards(SessionGuard)
  getIndex(@Session() session) {
    console.log(session.email);
    return this.sellerService.getAll();
  }
  @Post('login')
  async login(
    @Body() createSellerProfileDto: CreateSellerProfileDto,
    @Session() session,
  ) {
    const user = await this.sellerService.login(createSellerProfileDto);

    if (user) {
      session.email = createSellerProfileDto.sellerusername; // Set the email in the session

      return {
        success: true,
        message: 'Login successful',
        user: user, // This includes the user details in the response
      };
    } else {
      console.log('Unauthorized login attempt');
      throw new HttpException('UnauthorizedException', HttpStatus.UNAUTHORIZED);
    }
  }
}
