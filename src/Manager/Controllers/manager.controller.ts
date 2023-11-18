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
import { ManagerService } from 'src/Manager/services/manager.service';
// import { CreateProductDto } from '../dtos/Create_Product_dto';
import { CreateCategoryDto } from 'src/Products/dtos/Create_Category_dto';
import { CreateProductDto } from 'src/Products/dtos/Create_Product_dto';
import { Product } from 'src/Products/module/product.entity';
import { CreateManagerProfileDto } from '../dtos/create-manager.dto';
import { SessionGuard } from '../manager.gaurds';
// import { ManagerService } from '../services/manager.service';
import { LandProfile } from 'src/LandOwner/module/addLand.entity';

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
  //

  @Get('seeAllLandPost')
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

  @Get('buyLand/:landId')
  findAllByOwnerId(@Param('landId') landId: number) {
    return this.managerService.findAllBylandId(landId);
  }

  //
  //
  @Post('addProduct')
  @UseGuards(SessionGuard)
  createProduct(@Body() product: CreateProductDto): Promise<Product> {
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
  @Get('singleProduct/:id')
  findOne(@Param('id') id: number) {
    return this.managerService.findOneById(id);
  }

  @Put('updateProduct/:id')
  update(
    @Param('id') id: number,
    @Body() updateLandProfileDto: Partial<Product>,
  ) {
    return this.managerService.update(id, updateLandProfileDto);
  }

  @Delete('deleteProduct:id')
  remove(@Param('id') id: number) {
    return this.managerService.removeProduct(id);
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
