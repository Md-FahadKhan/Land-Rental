// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage, MulterError } from 'multer';
// import { ManagerService } from '../services/manager.service';

// import {
//   Body,
//   Controller,
//   Get,
//   Inject,
//   Param,
//   Post,
//   UseInterceptors,
//   UsePipes,
//   ValidationPipe,
// } from '@nestjs/common';

// @Controller('seller')
// export class ManagerController {
//   constructor(
//     @Inject(ManagerService) private readonly managerService: ManagerService,
//   ) {}

//   @Get('index')
//   @UsePipes(new ValidationPipe())
//   getIndex(): string {
//     return 'hello index';
//   }
//   @Post('addSellerProfilePicture')
//   @UsePipes(new ValidationPipe())
//   @UseInterceptors(
//     FileInterceptor('profilepic', {
//       fileFilter: (req, file, cb) => {
//         if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
//           cb(null, true);
//         else {
//           cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
//         }
//       },
//       limits: { fileSize: 30000 },
//       storage: diskStorage({
//         destination: './upload',
//         filename: function (req, file, cb) {
//           cb(null, Date.now() + file.originalname);
//         },
//       }),
//     }),
//   )
// addManager(
//   @Body() createManagerProfileDto: CreateManagerProfileDto,
//   // @UploadedFile() file: Express.Multer.File,
// ): Promise<ManagerProfile> {
//   //createAdminDto.filename = file.filename;
//   return this.managerService.createManager(createManagerProfileDto);
// }
// @Post('addSeller')
// addSeller(@Body() sellerInfo) {
//   return this.managerService.addSeller(sellerInfo);
// }
// @Put('update/:id')
// updateAdmin(
//   @Param('id') id: number,
//   @Body() createManagerProfileDto: CreateManagerProfileDto,
// ) {
//   return this.managerService.updateManger(id, createManagerProfileDto);
// }

// @Get()
// async findAllSeller(): Promise<SellerProfile[]> {
//   return this.managerService.getAllSeller();
// }
// @Get(':id')
// async findOne(@Param('id') id: number): Promise<SellerProfile> {
//   return this.managerService.getSellerById(id);
// }

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
//}
