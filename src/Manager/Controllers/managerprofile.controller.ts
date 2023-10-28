import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { ManagerService } from '../services/manager.service';

import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateManagerProfileDto } from '../dtos/create-manager.dto';
import { ManagerProfile } from '../module/managerProfile.entity';

@Controller('manager')
export class ManagerProfileController {
  constructor(
    @Inject(ManagerService) private readonly managerService: ManagerService,
  ) {}
  @Post('registration')
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
  addSeller(
    @Body() createmangerDto: CreateManagerProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ManagerProfile> {
    createmangerDto.managerprofilepicture = file.filename;
    return this.managerService.ManagerRegistration(createmangerDto);
  }
  @Put('update/:managerid') // Use ':managerid' to match the @Param name
  updateProfile(
    @Param('managerid') id: number, // Use 'managerid' to match the route parameter
    @Body() createmangerDto: CreateManagerProfileDto,
  ) {
    return this.managerService.updateProfile(id, createmangerDto);
  }

  @Get('allManager')
  async findAll(): Promise<ManagerProfile[]> {
    return this.managerService.getAllManager();
  }
  @Get(':managerid')
  async findOne(@Param('managerid') id: number): Promise<ManagerProfile> {
    return this.managerService.getManagerById(id);
  }
}
