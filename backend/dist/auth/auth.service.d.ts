import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: import("../users/user.entity").User;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: import("../users/user.entity").User;
        token: string;
    }>;
    generateToken(user: any): string;
    validateUser(userId: string): Promise<import("../users/user.entity").User>;
}
