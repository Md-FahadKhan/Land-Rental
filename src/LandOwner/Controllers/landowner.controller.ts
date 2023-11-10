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
import { CreateLandownerProfileDto } from '../dtos/create-landowner.dto';
import { SessionGuard } from '../landowner.gaurds';
import { LandownerService } from '../services/landowner.service';

@Controller('landowner')
export class LandowneController {
  constructor(private readonly landownerService: LandownerService) {}

  @Get('hello')
  getHello(): string {
    return 'hello from admin';
  }
  @Get('profile')
  @UseGuards(SessionGuard)
  async getProfile(@Session() session) {
    if (session && session.email) {
      const profile = await this.landownerService.getProfileByEmail(
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
    return this.landownerService.getAll();
  }
  @Post('login')
  async login(
    @Body() createLandownerProfileDto: CreateLandownerProfileDto,
    @Session() session,
  ) {
    const user = await this.landownerService.login(createLandownerProfileDto);

    if (user) {
      session.email = createLandownerProfileDto.landownerusername; // Set the email in the session

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
