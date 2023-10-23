import { FileInterceptor } from '@nestjs/platform-express';
import { ManagerService } from '../services/manager.service';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ManagerProfile } from '../module/managerProfile.entity';
import { CreateManagerProfileDto } from '../dtos/create-manager.dto';

@Controller('manager')
export class ManagerController {
  constructor(
    @Inject(ManagerService) private readonly managerService: ManagerService,
  ) {}

  @Get('index')
  @UsePipes(new ValidationPipe())
  getIndex(): string {
    return 'hello index';
  }
  // @Post('add')
  // @UsePipes(new ValidationPipe())
  // @UseInterceptors(
  //   FileInterceptor('profilepic', {
  //     fileFilter: (req, file, cb) => {
  //       if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
  //         cb(null, true);
  //       else {
  //         cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
  //       }
  //     },
  //     limits: { fileSize: 30000 },
  //     storage: diskStorage({
  //       destination: './upload',
  //       filename: function (req, file, cb) {
  //         cb(null, Date.now() + file.originalname);
  //       },
  //     }),
  //   }),
  // )
  // addManager(
  //   @Body() createManagerProfileDto: CreateManagerProfileDto,
  //   // @UploadedFile() file: Express.Multer.File,
  // ): Promise<ManagerProfile> {
  //   //createAdminDto.filename = file.filename;
  //   return this.managerService.createManager(createManagerProfileDto);
  // }

  @Post('createmanger')
  createManager(@Body() managerInfo) {
    return this.managerService.createManager(managerInfo);
  }
  // @Put('update/:id')
  // updateAdmin(
  //   @Param('id') id: number,
  //   @Body() createManagerProfileDto: CreateManagerProfileDto,
  // ) {
  //   return this.managerService.updateManger(id, createManagerProfileDto);
  // }

  @Get()
  async findAll(): Promise<ManagerProfile[]> {
    return this.managerService.getAllManager();
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ManagerProfile> {
    return this.managerService.getManagerById(id);
  }

  // @Get('getmanagers/:id')
  // getManagers(@Param('id') id: number) {
  //   return this.managerService.getAllManager();
  // }
  // @Get('getadminbymanager/:id')
  // getAdminByManager(@Param('id') id: number) {
  //   return this.managerService.getManagerByManager(id);
  // }
  // @Post('product')
  // addProductToCategory(@Body() productId: number, categoryId: number) {
  //   return this.adminService.addProductToCategory(productId, categoryId);
  // }
  // @Post('product')
  // async addProductToCategory(
  //   @Body() body: { productId: number; categoryId: number },
  // ): Promise<any> {
  //   const { productId, categoryId } = body;

  //   const product = await this.adminService.addProductToCategory(
  //     productId,
  //     categoryId,
  //   );
  //   if (product) {
  //     return { message: 'Product added to category successfully' };
  //   } else {
  //     return { message: 'Product or category not found' };
  //   }
  // }

  // @Post('addCategory')
  // addCategory(@Body() category: CreateCategoryDto): Promise<CategoryEntity> {
  //   return this.adminService.addCategory(category);
  // }
  // @Post('addProduct')
  // addProduct(@Body() product: CreateProductDto): Promise<ProductEntity> {
  //   return this.adminService.addProduct(product);
  // }
}
