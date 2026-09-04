import { UserRole } from '../user.entity';
export declare class CreateUserDto {
    name: string;
    email: string;
    address: string;
    password: string;
    role?: UserRole;
}
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    address?: string;
    role?: UserRole;
}
export declare class UpdatePasswordDto {
    currentPassword: string;
    newPassword: string;
}
