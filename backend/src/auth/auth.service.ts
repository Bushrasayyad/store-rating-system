
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await argon2.hash(registerDto.password);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(user.password, loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  generateToken(user: any) {
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role,
      name: user.name 
    };
    return this.jwtService.sign(payload);
  }

  async validateUser(userId: string) {
    return this.usersService.findOne(userId);
  }
}