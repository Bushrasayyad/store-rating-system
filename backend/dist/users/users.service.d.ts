import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto, UpdatePasswordDto, UpdateUserDto } from './dto/user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(filters?: {
        name?: string;
        email?: string;
        address?: string;
        role?: UserRole;
    }): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    create(createUserDto: CreateUserDto): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<User>;
    delete(id: string): Promise<void>;
    getStatistics(): Promise<{
        totalUsers: number;
        adminUsers: number;
        storeOwners: number;
        normalUsers: number;
    }>;
}
