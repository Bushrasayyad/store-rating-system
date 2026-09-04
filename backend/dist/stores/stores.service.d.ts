import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';
export declare class StoresService {
    private storesRepository;
    constructor(storesRepository: Repository<Store>);
    findAll(filters?: {
        name?: string;
        email?: string;
        address?: string;
    }): Promise<Store[]>;
    findOne(id: string): Promise<Store>;
    findByOwner(ownerId: string): Promise<Store[]>;
    create(createStoreDto: CreateStoreDto): Promise<Store>;
    update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store>;
    delete(id: string): Promise<void>;
    getStatistics(): Promise<{
        totalStores: number;
        storesWithRatings: number;
    }>;
}
