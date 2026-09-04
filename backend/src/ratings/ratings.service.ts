import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { Store } from '../stores/store.entity';
import { CreateRatingDto } from './dto/rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  async create(createRatingDto: CreateRatingDto): Promise<Rating> {
    const store = await this.storesRepository.findOne({
      where: { id: createRatingDto.storeId },
    });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const existingRating = await this.ratingsRepository.findOne({
      where: {
        userId: createRatingDto.userId,
        storeId: createRatingDto.storeId,
      },
    });
    if (existingRating) {
      throw new ConflictException('You have already rated this store');
    }

    const rating = this.ratingsRepository.create(createRatingDto);
    const savedRating = await this.ratingsRepository.save(rating);

    await this.updateStoreRating(createRatingDto.storeId);
    return savedRating;
  }

  async update(id: string, ratingValue: number): Promise<Rating> {
    const rating = await this.ratingsRepository.findOne({ where: { id } });
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    rating.rating = ratingValue;
    const updatedRating = await this.ratingsRepository.save(rating);

    await this.updateStoreRating(rating.storeId);
    return updatedRating;
  }

  async delete(id: string): Promise<void> {
    const rating = await this.ratingsRepository.findOne({ where: { id } });
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    const storeId = rating.storeId;
    await this.ratingsRepository.remove(rating);

    await this.updateStoreRating(storeId);
  }

  async findByUser(userId: string): Promise<Rating[]> {
    return this.ratingsRepository.find({
      where: { userId },
      relations: ['store'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStore(storeId: string): Promise<Rating[]> {
    return this.ratingsRepository.find({
      where: { storeId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserAndStore(userId: string, storeId: string): Promise<Rating | null> {
    return this.ratingsRepository.findOne({
      where: { userId, storeId },
    });
  }

  async getRatingStatistics(storeId: string) {
    const ratings = await this.ratingsRepository.find({
      where: { storeId },
    });

    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

    const ratingDistribution = {
      1: ratings.filter(r => r.rating === 1).length,
      2: ratings.filter(r => r.rating === 2).length,
      3: ratings.filter(r => r.rating === 3).length,
      4: ratings.filter(r => r.rating === 4).length,
      5: ratings.filter(r => r.rating === 5).length,
    };

    return { totalRatings, averageRating, ratingDistribution };
  }

  private async updateStoreRating(storeId: string): Promise<void> {
    const ratings = await this.ratingsRepository.find({
      where: { storeId },
    });

    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

    await this.storesRepository.update(storeId, {
      totalRatings,
      averageRating: parseFloat(averageRating.toFixed(2)),
    });
  }
}