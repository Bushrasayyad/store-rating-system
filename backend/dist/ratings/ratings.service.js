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
exports.RatingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rating_entity_1 = require("./rating.entity");
const store_entity_1 = require("../stores/store.entity");
let RatingsService = class RatingsService {
    constructor(ratingsRepository, storesRepository) {
        this.ratingsRepository = ratingsRepository;
        this.storesRepository = storesRepository;
    }
    async create(createRatingDto) {
        const store = await this.storesRepository.findOne({
            where: { id: createRatingDto.storeId },
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
        const existingRating = await this.ratingsRepository.findOne({
            where: {
                userId: createRatingDto.userId,
                storeId: createRatingDto.storeId,
            },
        });
        if (existingRating) {
            throw new common_1.ConflictException('You have already rated this store');
        }
        const rating = this.ratingsRepository.create(createRatingDto);
        const savedRating = await this.ratingsRepository.save(rating);
        await this.updateStoreRating(createRatingDto.storeId);
        return savedRating;
    }
    async update(id, ratingValue) {
        const rating = await this.ratingsRepository.findOne({ where: { id } });
        if (!rating) {
            throw new common_1.NotFoundException('Rating not found');
        }
        rating.rating = ratingValue;
        const updatedRating = await this.ratingsRepository.save(rating);
        await this.updateStoreRating(rating.storeId);
        return updatedRating;
    }
    async delete(id) {
        const rating = await this.ratingsRepository.findOne({ where: { id } });
        if (!rating) {
            throw new common_1.NotFoundException('Rating not found');
        }
        const storeId = rating.storeId;
        await this.ratingsRepository.remove(rating);
        await this.updateStoreRating(storeId);
    }
    async findByUser(userId) {
        return this.ratingsRepository.find({
            where: { userId },
            relations: ['store'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByStore(storeId) {
        return this.ratingsRepository.find({
            where: { storeId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByUserAndStore(userId, storeId) {
        return this.ratingsRepository.findOne({
            where: { userId, storeId },
        });
    }
    async getRatingStatistics(storeId) {
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
    async updateStoreRating(storeId) {
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
};
exports.RatingsService = RatingsService;
exports.RatingsService = RatingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rating_entity_1.Rating)),
    __param(1, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RatingsService);
//# sourceMappingURL=ratings.service.js.map