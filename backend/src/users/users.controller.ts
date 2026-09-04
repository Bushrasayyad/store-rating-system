import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';  // Same folder
import { CreateUserDto, UpdatePasswordDto, UpdateUserDto } from './dto/user.dto';  // Same folder
import { JwtAuthGuard } from '../auth/jwt-auth.guard';  // Go up 1 level, then auth
import { RolesGuard } from '../auth/roles.guard';  // Go up 1 level, then auth
import { Roles } from '../auth/roles.decorator';  // Go up 1 level, then auth
import { UserRole } from './user.entity';  // Same folder

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('address') address?: string,
    @Query('role') role?: UserRole,
  ) {
    return this.usersService.findAll({ name, email, address, role });
  }

  @Get('statistics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getStatistics() {
    return this.usersService.getStatistics();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Put(':id/password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Request() req,
  ) {
    // Users can only update their own password
    if (req.user.id !== id) {
      throw new Error('You can only update your own password');
    }
    return this.usersService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { message: 'User deleted successfully' };
  }
}