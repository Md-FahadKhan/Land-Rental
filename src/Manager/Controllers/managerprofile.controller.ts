import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { CreateManagerProfileDto } from '../dtos/create-manager.dto';
import { ManagerProfile } from '../module/managerProfile.entity';
import { ManagerService } from '../services/manager.service';

@Controller('manager')
export class ManagerProfileController {
  constructor(private readonly managerService: ManagerService) {}
  @Get('hello')
  getHello(): string {
    return 'hello from admin';
  }

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
  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Req() req, @Session() session: Record<string, any>): string {
    // Authentication complete
    console.log(session);
    console.log(session.id);

    return req.user;
  }
}
