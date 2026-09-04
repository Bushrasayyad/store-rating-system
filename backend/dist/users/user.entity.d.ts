import { Rating } from '../ratings/rating.entity';
import { Store } from '../stores/store.entity';
export declare enum UserRole {
    ADMIN = "admin",
    STORE_OWNER = "store_owner",
    NORMAL = "normal"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    address: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    stores: Store[];
    ratings: Rating[];
}
