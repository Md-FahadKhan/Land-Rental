import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from '../module/admin.entity';
import { AdminInfo } from '../dtos/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity) 
    private adminRepo: Repository<AdminEntity>
  )
  {}
  getAll(): Promise<AdminEntity[]> {
    return this.adminRepo.find(
      {
        select:{
          name: true,
          username: true
        }
      }
    );
  }

 async addAdmin(adminInfo:AdminInfo):Promise<AdminEntity[]>
  {
   const res = await this.adminRepo.save(adminInfo);
   return this.adminRepo.find();
  }

  updateAdmin(id:number, adminInfo:AdminInfo):Promise<AdminEntity>
  {
   const res=  this.adminRepo.update(id,adminInfo);
     return this.adminRepo.findOneBy({id});
  }

  updatebyAdmin(id:number, adminInfo:AdminInfo):Promise<AdminEntity>
  {
   const res=  this.adminRepo.update(id,adminInfo);
     return this.adminRepo.findOneBy({id});
  }

  async deleteadmin(id: number): Promise<void> {
    await this.adminRepo.delete(id);
    }

}