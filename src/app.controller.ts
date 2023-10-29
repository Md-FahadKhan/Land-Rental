import {
  Controller,
  Get,
  Post,
  Request,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';


@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login(@Request() req, @Session() session: Record<string, any>): string {
    // authentication complete
    console.log(session);
    console.log(session.id);

    return req.user;
  }
}
