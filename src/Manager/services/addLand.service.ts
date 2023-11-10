import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddLand } from '../module/addLand.entity';

@Injectable()
export class LandService {
  // for testing
  constructor(
    @InjectRepository(AddLand)
    private addLandRepository: Repository<AddLand>,
  ) {}

  async create(
    ownerId: number,
    createLandProfileDto: Partial<AddLand>,
  ): Promise<AddLand> {
    const landProfile = this.addLandRepository.create({
      ...createLandProfileDto,
      manager: { id: ownerId },
    });
    return await this.addLandRepository.save(landProfile);
  }

  async findAllByOwnerId(ownerId: number): Promise<AddLand[]> {
    return this.addLandRepository.find({
      where: { manager: { id: ownerId } },
    });
  }

  async findOneById(id: number): Promise<AddLand> {
    return this.addLandRepository.findOne({ where: { landid: id } });
  }

  async update(
    id: number,
    updateLandProfileDto: Partial<AddLand>,
  ): Promise<AddLand> {
    await this.addLandRepository.update(id, updateLandProfileDto);
    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    await this.addLandRepository.delete(id);
  }

  //   emailService: any;
  //   constructor(
  //     @InjectRepository(LandProfile)
  //     private landProfileRepository: Repository<LandProfile>, // @InjectRepository(ProductEntity)
  //   ) {}
  //   async addLand(addLandProfileDto: AddLandProfileDto): Promise<LandProfile> {
  //     const newLandProfile = new LandProfile();
  //     newLandProfile.landname = addLandProfileDto.landname; // Populate the landname property
  //     // You can set other properties as needed
  //     const res = await this.landProfileRepository.save(newLandProfile);
  //     return res; // Return the newly created LandProfile
  //   }
}
