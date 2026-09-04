import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Store } from './store.entity';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  async findAll(filters?: { name?: string; email?: string; address?: string }) {
    const where: FindOptionsWhere<Store> = {};
    
    if (filters?.name) {
      where.name = Like(`%${filters.name}%`);
    }
    if (filters?.email) {
      where.email = Like(`%${filters.email}%`);
    }
    if (filters?.address) {
      where.address = Like(`%${filters.address}%`);
    }

    return this.storesRepository.find({
      where,
      relations: ['owner', 'ratings'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storesRepository.findOne({
      where: { id },
      relations: ['owner', 'ratings', 'ratings.user'],
    });
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }

  async findByOwner(ownerId: string): Promise<Store[]> {
    return this.storesRepository.find({
      where: { ownerId },
      relations: ['ratings', 'ratings.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const existingStore = await this.storesRepository.findOne({
      where: { email: createStoreDto.email },
    });
    if (existingStore) {
      throw new ConflictException('Store with this email already exists');
    }

    const store = this.storesRepository.create(createStoreDto);
    return this.storesRepository.save(store);
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);
    Object.assign(store, updateStoreDto);
    return this.storesRepository.save(store);
  }

  async delete(id: string): Promise<void> {
    const store = await this.findOne(id);
    await this.storesRepository.remove(store);
  }

  async getStatistics() {
    const totalStores = await this.storesRepository.count();
    const storesWithRatings = await this.storesRepository
      .createQueryBuilder('store')
      .where('store.totalRatings > 0')
      .getCount();

    return { totalStores, storesWithRatings };
  }
}