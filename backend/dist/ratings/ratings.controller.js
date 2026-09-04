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
exports.RatingsController = void 0;
const common_1 = require("@nestjs/common");
const ratings_service_1 = require("./ratings.service");
const rating_dto_1 = require("./dto/rating.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let RatingsController = class RatingsController {
    constructor(ratingsService) {
        this.ratingsService = ratingsService;
    }
    async create(createRatingDto, req) {
        return this.ratingsService.create({
            ...createRatingDto,
            userId: req.user.id,
        });
    }
    async update(id, rating) {
        return this.ratingsService.update(id, rating);
    }
    async delete(id) {
        return this.ratingsService.delete(id);
    }
    async findByStore(storeId) {
        return this.ratingsService.findByStore(storeId);
    }
    async findByUser(req) {
        return this.ratingsService.findByUser(req.user.id);
    }
    async getStatistics(storeId) {
        return this.ratingsService.getRatingStatistics(storeId);
    }
};
exports.RatingsController = RatingsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rating_dto_1.CreateRatingDto, Object]),
    __metadata("design:returntype", Promise)
], RatingsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('rating')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], RatingsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RatingsController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('store/:storeId'),
    __param(0, (0, common_1.Param)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RatingsController.prototype, "findByStore", null);
__decorate([
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RatingsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('store/:storeId/statistics'),
    __param(0, (0, common_1.Param)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RatingsController.prototype, "getStatistics", null);
exports.RatingsController = RatingsController = __decorate([
    (0, common_1.Controller)('ratings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ratings_service_1.RatingsService])
], RatingsController);
//# sourceMappingURL=ratings.controller.js.map