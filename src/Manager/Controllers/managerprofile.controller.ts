import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
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
import { ManagerPicture } from '../module/managerPicture.entity';
import { CreateManagerPictureDto } from '../dtos/managerPicture.dto';
import { SessionGuard } from '../manager.gaurds';
import { Manager } from '../module/managerpersonal.entity';

@Controller('manager')
export class ManagerProfileController {
  constructor(private readonly managerService: ManagerService) {}

  @Post('add')
  async createManagerWithProfile(
    @Body() data: { manager: Manager; managerProfile: ManagerProfile },
  ) {
    try {
      const { manager, managerProfile } = data;

      const result = await this.managerService.createManager(
        manager,
        managerProfile,
      );
      return {
        success: true,
        message: 'Manager and ManagerProfile created successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Manager and ManagerProfile creation failed',
        error: error.message,
      };
    }
  }

  @Get('hello')
  getHello(): string {
    return 'hello from admin';
  }

  @Get('index')
  @UseGuards(SessionGuard)
  getIndex(@Session() session) {
    console.log(session.email);
    return this.managerService.getAll();
  }

  @Get('profiledetails')
  @UseGuards(SessionGuard)
  getProfile(@Session() session) {
    console.log(session.email);
    console.log('Reached the getProfile route');
    console.log('Session email:', session.email);
    return this.managerService.getProfile();
  }

  @Put('update/:id') // Use a PUT request to update a profile by its ID
  @UseGuards(SessionGuard)
  async updateProfile(
    @Param('id') id: number,
    @Body() updatedProfile: ManagerProfile,
  ) {
    try {
      const result = await this.managerService.updateProfile(
        id,
        updatedProfile,
      );
      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      return {
        success: false,
        message: 'Profile update failed',
        error: error.message,
      };
    }
  }

  @Post('login')
  async login(
    @Body() createManagerProfileDto: CreateManagerProfileDto,
    @Session() session,
  ) {
    const user = await this.managerService.login(createManagerProfileDto);

    if (user) {
      session.email = createManagerProfileDto.managerusername;
      return true;
    } else {
      console.log('Unauthorized login attempt');
      throw new HttpException('UnauthorizedException', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('picture')
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
  async addLandPicture(
    @Body() createManagerPictureDto: CreateManagerPictureDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ManagerPicture> {
    if (!file) {
      throw new HttpException(
        'Profile picture is required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    createManagerPictureDto.managerPicturename = file.filename;

    return this.managerService.addManagerPicture(createManagerPictureDto);
  }
}
