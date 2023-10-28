import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ManagerProfile } from '../module/managerProfile.entity';
@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(ManagerProfile)
    private mangerProfileRepository: Repository<ManagerProfile>, // @InjectRepository(ManagerEntity)
    // private managerRepository: Repository<ManagerEntity>,
  ) // @InjectRepository(CategoryEntity)
  // private categoryRepository: Repository<CategoryEntity>,
  // @InjectRepository(ProductEntity)
  // private productRepository: Repository<ProductEntity>,
  {}

  //   async addProductToCategory(
  //     productId: number,
  //     categoryId: number,
  //   ): Promise<any> {
  //     const product = await this.productRepository.findOne({
  //       where: { productId: productId },
  //     });

  //     const category = await this.categoryRepository.findOne({
  //       where: { categoryId: categoryId },
  //     });

  //     if (product && category) {
  //       if (!Array.isArray(product.categories)) {
  //         product.categories = []; // Initialize it as an empty array if not already an array.
  //       }

  //       product.categories = [...product.categories, category];
  //       await this.productRepository.save(product);
  //     } else {
  //       return { message: 'Product or category not found' };
  //     }
  //   }

  // adminRepository is the local repository

  ManagerRegistration(mangerProfile: ManagerProfile) {
    return this.mangerProfileRepository.save(mangerProfile);
  }

  // async updateProfile(
  //   id: number,
  //   updatedAdmin: ManagerProfile,
  // ): Promise<ManagerProfile> {
  //   await this.mangerProfileRepository.update({ managerid: id }, updatedAdmin);
  //   return this.mangerProfileRepository.findOneBy({ managerid: id });
  // }

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
