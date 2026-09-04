import { UsersService } from './users.service';
import { CreateUserDto, UpdatePasswordDto, UpdateUserDto } from './dto/user.dto';
import { UserRole } from './user.entity';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(name?: string, email?: string, address?: string, role?: UserRole): Promise<import("./user.entity").User[]>;
    getStatistics(): Promise<{
        totalUsers: number;
        adminUsers: number;
        storeOwners: number;
        normalUsers: number;
    }>;
    findOne(id: string): Promise<import("./user.entity").User>;
    create(createUserDto: CreateUserDto): Promise<import("./user.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./user.entity").User>;
    updatePassword(id: string, updatePasswordDto: UpdatePasswordDto, req: any): Promise<import("./user.entity").User>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
