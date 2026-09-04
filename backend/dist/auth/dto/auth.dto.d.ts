import { UserRole } from '../../users/user.entity';
export declare class RegisterDto {
    name: string;
    email: string;
    address: string;
    password: string;
    role?: UserRole;
}
export declare class LoginDto {
    email: string;
    password: string;
}
