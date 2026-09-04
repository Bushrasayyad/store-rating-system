import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Get()
  async findAll(
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('address') address?: string,
  ) {
    return this.storesService.findAll({ name, email, address });
  }

  @Get('statistics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getStatistics() {
    return this.storesService.getStatistics();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(id, updateStoreDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    await this.storesService.delete(id);
    return { message: 'Store deleted successfully' };
  }
}