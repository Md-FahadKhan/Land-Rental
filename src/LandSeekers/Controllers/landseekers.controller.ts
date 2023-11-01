import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { promises } from 'dns';
import { userInfo } from 'os';
import { UserService } from '../services/landseekers.service';
import { UserEntity } from '../module/landseeker.entity';
import { UserInfo } from '../dtos/create-landseekers.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('index')
  getIndex() {
    return this.userService.getAll();
    
  }
  @Get('/searchUserby/:id')
  searchUserBy(@Param('id') userID:number): Promise<UserEntity> {
  return this.userService.getUserByID(userID);
  }

  @Get('/searchUserbyobject')
  @UsePipes(new ValidationPipe())
  searchUserByObject(@Body() myobject:UserInfo): object {
  return {"name":myobject.name};
}

@Post('upload')
@UseInterceptors(FileInterceptor('myfile',
{ fileFilter: (req, file, cb) => {
  if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
   cb(null, true);
  else {
   cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
   }
  },
  limits: { fileSize: 30000 },
  storage:diskStorage({
  destination: './upload',
  filename: function (req, file, cb) {
   cb(null,Date.now()+file.originalname)
  },
  })
}
))

uploadFile(@UploadedFile() file: Express.Multer.File) {
 console.log(file);
}
@Get('/getimage/:name')
 getImages(@Param('name') name:string, @Res() res) {
 res.sendFile(name,{ root: './upload' })
 }


 @Post('adduser')
 @UsePipes(new ValidationPipe())
 @UseInterceptors(FileInterceptor('profilepic',
 { fileFilter: (req, file, cb) => {
   if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
    cb(null, true);
   else {
    cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
    }
   },
   limits: { fileSize: 30000 },
   storage:diskStorage({
   destination: './upload',
   filename: function (req, file, cb) {
    cb(null,Date.now()+file.originalname)
   },
   })
 }
 ))
 addUser(@Body() userInfo:UserInfo, @UploadedFile()  myfile: Express.Multer.File):Promise<UserEntity[]> {
   userInfo.filename = myfile.filename;
 return this.userService.addUser(userInfo);
 }

 @Put('/update/:id')
 updateUserInfo(@Param('id') id:number, @Body() userInfo:UserInfo)
 {
   return this.userService.updateUserInfo(id,userInfo);
 }
 @Patch('/updateBy/:id')
 updateUser(@Param('id') id:number, @Body() userInfo:UserInfo)
 {
   return this.userService.updateUser(id,userInfo);
 }
 @Delete('/delete/:id')
 deleteUser(@Param('id') id: number) {
   return this.userService.deleteUser(id);
 }


/*

  @Post('/addUser')
  @UsePipes(new ValidationPipe()) // Apply validation
  addAdmin(@Body() user: UserInfo): Promises<UserEntity> {
    

  
    // Return the added user
    return this.userService.addUser(userInfo);
  }
  @Post('upload')
  @UseInterceptors(FileInterceptor('file',
  { fileFilter: (req, file, cb) => {
  if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
  cb(null, true);
  else {
  cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
  }
  },
  limits: { fileSize: 30000 },
  storage:diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {
  cb(null,Date.now()+file.originalname)
  },
  })
  }))
  uploadFiles(@UploadedFile() file: Express.Multer.File) {
  console.log(file);
  }
  
  @Get()
  getUsers(): UserInfo[] {
    return this.users;
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number): UserInfo {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Get('/searchUserBy')
  getNameAndId(@Query('id') id: string, @Query('name') name: string): string {
    return `The user is ${name} and Id is ${id}`;
  }

  @Put(':id')
  updateUsers(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UserInfo,
  ): UserInfo {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users[userIndex] = updateUserDto;
    return updateUserDto;
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): string {
    this.users = this.users.filter((u) => u.id !== id);
    return id + "is deleted";
  }
  */
}
