import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ManagerProfile } from '../module/managerProfile.entity';
@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(ManagerProfile)
    private mangerProfileRepository: Repository<ManagerProfile>, // @InjectRepository(ManagerEntity)
  ) {}

  ManagerRegistration(mangerProfile: ManagerProfile) {
    return this.mangerProfileRepository.save(mangerProfile);
  }

  async updateProfile(
    id: number,
    updatedProfile: ManagerProfile,
  ): Promise<ManagerProfile | null> {
    // Find the entity by managerid
    const managerProfile = await this.mangerProfileRepository.findOneBy({
      managerid: id,
    });

    if (managerProfile) {
      // Apply the updates to the entity
      managerProfile.managerusername = updatedProfile.managerusername; // Update other fields as needed
      managerProfile.managername = updatedProfile.managername;
      managerProfile.managerprofilepicture =
        updatedProfile.managerprofilepicture;
      // Save the updated entity back to the database
      await this.mangerProfileRepository.save(managerProfile);

      // Return the updated entity
      return managerProfile;
    } else {
      return null; // Handle the case where the entity with the given ID is not found
    }
  }

  async getAllManager(): Promise<ManagerProfile[]> {
    return this.mangerProfileRepository.find();
  }
  async getManagerById(id: number): Promise<ManagerProfile> {
    return this.mangerProfileRepository.findOneBy({ managerid: id });
  }

  async getManagerByUsername(
    managerusername: string,
  ): Promise<ManagerProfile | undefined> {
    return this.mangerProfileRepository.findOne({
      where: {
        managerusername: managerusername,
      },
    });
  }
}

// async updateManger(
//   id: number,
//   updateManager: ManagerProfile,
// ): Promise<ManagerProfile> {
//   await this.managerProfileRepository.update(id, updateManager);
//   return this.managerProfileRepository.findOneBy({ id: id });
// }

// async deleteManager(id: number): Promise<void> {
//   await this.managerProfileRepository.delete(id);
// }

// createManager(managerInfo: ManagerProfile) {
//   return this.managerProfileRepository.save(managerInfo);
// }

//   getManagers(id: number) {
//       return this.managerProfileRepository.find({
//         where: { id: id },
//         relations: { managers: true },
//       });
//     }
//   addCategory(categoryInfo: CreateCategoryDto) {
//     return this.categoryRepository.save(categoryInfo);
//   }

//   addProduct(productInfo: CreateProductDto) {
//     return this.productRepository.save(productInfo);
//   }
//   getAdminByManager(id: number) {
//     return this.managerRepository.find({
//       where: { id: id },
//       relations: { admin: true },
//     });
//   }
