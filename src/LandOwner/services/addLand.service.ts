import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LandProfile } from '../module/addLand.entity';

@Injectable()
export class LandService {
  // for testing
  constructor(
    @InjectRepository(LandProfile)
    private landProfileRepository: Repository<LandProfile>,
  ) {}

  async create(
    ownerId: number,
    createLandProfileDto: Partial<LandProfile>,
  ): Promise<LandProfile> {
    const landProfile = this.landProfileRepository.create({
      ...createLandProfileDto,
      owner: { id: ownerId },
    });
    return await this.landProfileRepository.save(landProfile);
  }

  async findAllByOwnerId(ownerId: number): Promise<LandProfile[]> {
    return this.landProfileRepository.find({
      where: { owner: { id: ownerId } },
    });
  }

  async findOneById(id: number): Promise<LandProfile> {
    return this.landProfileRepository.findOne({ where: { landid: id } });
  }

  async update(
    id: number,
    updateLandProfileDto: Partial<LandProfile>,
  ): Promise<LandProfile> {
    await this.landProfileRepository.update(id, updateLandProfileDto);
    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    await this.landProfileRepository.delete(id);
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
