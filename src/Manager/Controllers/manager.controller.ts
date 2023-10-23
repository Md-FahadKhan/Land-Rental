import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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

@Controller('manager')
export class ManagerContorller {
  @Get('index')
  getIndex(): string {
    return 'hello index';
  }
}
