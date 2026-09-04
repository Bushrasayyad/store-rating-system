"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_entity_1 = require("./store.entity");
let StoresService = class StoresService {
    constructor(storesRepository) {
        this.storesRepository = storesRepository;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.name) {
            where.name = (0, typeorm_2.Like)(`%${filters.name}%`);
        }
        if (filters?.email) {
            where.email = (0, typeorm_2.Like)(`%${filters.email}%`);
        }
        if (filters?.address) {
            where.address = (0, typeorm_2.Like)(`%${filters.address}%`);
        }
        return this.storesRepository.find({
            where,
            relations: ['owner', 'ratings'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const store = await this.storesRepository.findOne({
            where: { id },
            relations: ['owner', 'ratings', 'ratings.user'],
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
        return store;
    }
    async findByOwner(ownerId) {
        return this.storesRepository.find({
            where: { ownerId },
            relations: ['ratings', 'ratings.user'],
            order: { createdAt: 'DESC' },
        });
    }
    async create(createStoreDto) {
        const existingStore = await this.storesRepository.findOne({
            where: { email: createStoreDto.email },
        });
        if (existingStore) {
            throw new common_1.ConflictException('Store with this email already exists');
        }
        const store = this.storesRepository.create(createStoreDto);
        return this.storesRepository.save(store);
    }
    async update(id, updateStoreDto) {
        const store = await this.findOne(id);
        Object.assign(store, updateStoreDto);
        return this.storesRepository.save(store);
    }
    async delete(id) {
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
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StoresService);
//# sourceMappingURL=stores.service.js.map