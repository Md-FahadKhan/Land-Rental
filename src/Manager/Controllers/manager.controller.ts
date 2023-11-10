import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDto } from '../dtos/Create_Product_dto';
import { CreateManagerProfileDto } from '../dtos/create-manager.dto';
import { SessionGuard } from '../manager.gaurds';
import { ManagerService } from '../services/manager.service';

import { CreateCategoryDto } from '../dtos/Create_Category_dto';
import { Product } from '../module/product.entity';

interface Category {
  categoryId: number;
  name: String;
}
@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}
  @Post('addProduct')
  @UseGuards(SessionGuard)
  createProduct(@Body() product: CreateProductDto): Promise<Product> {
    return this.managerService.addProduct(product);
  }

  @Post('addCategory')
  createCategory(@Body() category: CreateCategoryDto): Promise<Category> {
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

  @Get('hello')
  getHello(): string {
    return 'hello from admin';
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
  @Post('login')
  async login(
    @Body() createManagerProfileDto: CreateManagerProfileDto,
    @Session() session,
  ) {
    const user = await this.managerService.login(createManagerProfileDto);

    if (user) {
      session.email = createManagerProfileDto.managerusername; // Set the email in the session

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
