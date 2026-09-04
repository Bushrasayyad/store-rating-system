import { User } from '../users/user.entity';
import { Rating } from '../ratings/rating.entity';
export declare class Store {
    id: string;
    name: string;
    email: string;
    address: string;
    averageRating: number;
    totalRatings: number;
    owner: User;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    ratings: Rating[];
}
