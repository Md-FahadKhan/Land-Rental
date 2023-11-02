import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { AdminInfo } from '../dtos/create-admin.dto';
import { AdminService } from '../services/admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('hello')
  getHello(): string {
    return 'hello from admin';
  }

  @Post('addadmin')
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
        destination: './upload',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  addAdmin(
    @Body() adminInfo: AdminInfo,
    @UploadedFile() myfile: Express.Multer.File,
  ) {
    adminInfo.filename = myfile.filename;
    return this.adminService.addAdmin(adminInfo);
  }

  @Patch('/updateBy/:id')
  updatebyAdmin(@Param('id') id: number, @Body() adminInfo: AdminInfo) {
    return this.adminService.updatebyAdmin(id, adminInfo);
  }

  @Put('/update/:id')
  updateAdmin(@Param('id') id: number, @Body() adminInfo: AdminInfo) {
    return this.adminService.updateAdmin(id, adminInfo);
  }

  @Delete('/delete/:id')
  deleteUser(@Param('id') id: number) {
    return this.adminService.deleteadmin(id);
  }
}
