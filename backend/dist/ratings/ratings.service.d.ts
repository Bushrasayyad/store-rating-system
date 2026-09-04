import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { Store } from '../stores/store.entity';
import { CreateRatingDto } from './dto/rating.dto';
export declare class RatingsService {
    private ratingsRepository;
    private storesRepository;
    constructor(ratingsRepository: Repository<Rating>, storesRepository: Repository<Store>);
    create(createRatingDto: CreateRatingDto): Promise<Rating>;
    update(id: string, ratingValue: number): Promise<Rating>;
    delete(id: string): Promise<void>;
    findByUser(userId: string): Promise<Rating[]>;
    findByStore(storeId: string): Promise<Rating[]>;
    findByUserAndStore(userId: string, storeId: string): Promise<Rating | null>;
    getRatingStatistics(storeId: string): Promise<{
        totalRatings: number;
        averageRating: number;
        ratingDistribution: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    }>;
    private updateStoreRating;
}
