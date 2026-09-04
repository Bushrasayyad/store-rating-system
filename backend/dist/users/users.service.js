"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const argon2 = __importStar(require("argon2"));
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
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
        if (filters?.role) {
            where.role = filters.role;
        }
        return this.usersRepository.find({
            where,
            relations: ['stores'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['stores', 'ratings', 'ratings.store'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
    async create(createUserDto) {
        const user = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(user);
    }
    async update(id, updateUserDto) {
        const user = await this.findOne(id);
        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }
    async updatePassword(id, updatePasswordDto) {
        const user = await this.findOne(id);
        const isPasswordValid = await argon2.verify(user.password, updatePasswordDto.currentPassword);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }
        user.password = await argon2.hash(updatePasswordDto.newPassword);
        return this.usersRepository.save(user);
    }
    async delete(id) {
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
    }
    async getStatistics() {
        const totalUsers = await this.usersRepository.count();
        const adminUsers = await this.usersRepository.count({ where: { role: user_entity_1.UserRole.ADMIN } });
        const storeOwners = await this.usersRepository.count({ where: { role: user_entity_1.UserRole.STORE_OWNER } });
        const normalUsers = await this.usersRepository.count({ where: { role: user_entity_1.UserRole.NORMAL } });
        return { totalUsers, adminUsers, storeOwners, normalUsers };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map