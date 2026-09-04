import { StoresService } from './stores.service';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';
export declare class StoresController {
    private storesService;
    constructor(storesService: StoresService);
    findAll(name?: string, email?: string, address?: string): Promise<import("./store.entity").Store[]>;
    getStatistics(): Promise<{
        totalStores: number;
        storesWithRatings: number;
    }>;
    findOne(id: string): Promise<import("./store.entity").Store>;
    create(createStoreDto: CreateStoreDto): Promise<import("./store.entity").Store>;
    update(id: string, updateStoreDto: UpdateStoreDto): Promise<import("./store.entity").Store>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
