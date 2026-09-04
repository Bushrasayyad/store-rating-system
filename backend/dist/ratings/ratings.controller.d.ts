import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/rating.dto';
export declare class RatingsController {
    private ratingsService;
    constructor(ratingsService: RatingsService);
    create(createRatingDto: CreateRatingDto, req: any): Promise<import("./rating.entity").Rating>;
    update(id: string, rating: number): Promise<import("./rating.entity").Rating>;
    delete(id: string): Promise<void>;
    findByStore(storeId: string): Promise<import("./rating.entity").Rating[]>;
    findByUser(req: any): Promise<import("./rating.entity").Rating[]>;
    getStatistics(storeId: string): Promise<{
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
}
