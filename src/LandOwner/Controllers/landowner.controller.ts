import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';

import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
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
import { LandownerService } from '../services/landowner.service';
import { SessionGuard } from '../landowner.gaurds';
import { CreateLandownerProfileDto } from '../dtos/create-landowner.dto';

@Controller('landowner')
export class LandowneController {
  constructor(private readonly landownerService: LandownerService) {}

  @Get('index')
  @UseGuards(SessionGuard)
  getIndex(@Session() session) {
    console.log(session.email);
    return this.landownerService.getAll();
  }

  @Post('login')
  async login(
    @Body() createLandownerProfileDto: CreateLandownerProfileDto,
    @Session() session,
  ): Promise<boolean> {
    const user = await this.landownerService.login(createLandownerProfileDto);

    if (user) {
      session.email = createLandownerProfileDto.landownerusername;
      return true;
    } else {
      console.log('Unauthorized login attempt');
      throw new HttpException('UnauthorizedException', HttpStatus.UNAUTHORIZED);
    }
  }
}
