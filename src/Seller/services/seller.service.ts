import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellerProfile } from '../module/seller.entity';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerProfile)
    private sellerProfileRepository: Repository<SellerProfile>, // @InjectRepository(ManagerEntity)
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

  SellerRegistration(sellerProfile: SellerProfile) {
    return this.sellerProfileRepository.save(sellerProfile);
  }

  async getAllSeller(): Promise<SellerProfile[]> {
    return this.sellerProfileRepository.find();
  }
  async getSellerById(id: number): Promise<SellerProfile> {
    return this.sellerProfileRepository.findOneBy({ sellerid: id });
  }
}
