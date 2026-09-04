import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto, UpdatePasswordDto, UpdateUserDto } from './dto/user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(filters?: { name?: string; email?: string; address?: string; role?: UserRole }) {
    const where: FindOptionsWhere<User> = {};
    
    if (filters?.name) {
      where.name = Like(`%${filters.name}%`);
    }
    if (filters?.email) {
      where.email = Like(`%${filters.email}%`);
    }
    if (filters?.address) {
      where.address = Like(`%${filters.address}%`);
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

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['stores', 'ratings', 'ratings.store'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<User> {
    const user = await this.findOne(id);
    
    const isPasswordValid = await argon2.verify(user.password, updatePasswordDto.currentPassword);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    user.password = await argon2.hash(updatePasswordDto.newPassword);
    return this.usersRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async getStatistics() {
    const totalUsers = await this.usersRepository.count();
    const adminUsers = await this.usersRepository.count({ where: { role: UserRole.ADMIN } });
    const storeOwners = await this.usersRepository.count({ where: { role: UserRole.STORE_OWNER } });
    const normalUsers = await this.usersRepository.count({ where: { role: UserRole.NORMAL } });

    return { totalUsers, adminUsers, storeOwners, normalUsers };
  }
}