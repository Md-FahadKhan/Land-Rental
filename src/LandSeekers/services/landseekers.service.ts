import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../module/landseeker.entity';
import { UserInfo, UserUpdateInfo } from '../dtos/create-landseekers.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) 
    private userRepo: Repository<UserEntity>
  )
  {}
  getAll(): Promise<UserEntity[]> {
    return this.userRepo.find(
      {
        select:{
          id: true,
          name: true,
          username: true,          
          address:true,
          filename:true
        
        }
        
      }
    );
  }

getUserByID(id:number): Promise<UserEntity> {
return this.userRepo.findOneBy({id:id});
}

 async addUser(userInfo:UserInfo):Promise<UserEntity[]>
  {
   const res = await this.userRepo.save(userInfo);
   return this.userRepo.find();
  }

  updateUserInfo(id:number, userInfo:UserUpdateInfo):Promise<UserEntity>
  {
   const res=  this.userRepo.update(id,userInfo);

     return this.userRepo.findOneBy({id});
  }
  updateUser(id:number, userInfo:UserUpdateInfo):Promise<UserEntity>
  {
   const res=  this.userRepo.update(id,userInfo);

     return this.userRepo.findOneBy({id});
  }
// Delete a user
async deleteUser(id: number): Promise<string> {
  // Delete the user with the provided ID
  await this.userRepo.delete(id);
  return id+" is deleted.";
  }

}