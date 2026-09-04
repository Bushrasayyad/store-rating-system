
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Post()
  async create(@Body() createRatingDto: CreateRatingDto, @Request() req) {
    return this.ratingsService.create({
      ...createRatingDto,
      userId: req.user.id,
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body('rating') rating: number) {
    return this.ratingsService.update(id, rating);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.ratingsService.delete(id);
  }

  @Get('store/:storeId')
  async findByStore(@Param('storeId') storeId: string) {
    return this.ratingsService.findByStore(storeId);
  }

  @Get('user')
  async findByUser(@Request() req) {
    return this.ratingsService.findByUser(req.user.id);
  }

  @Get('store/:storeId/statistics')
  async getStatistics(@Param('storeId') storeId: string) {
    return this.ratingsService.getRatingStatistics(storeId);
  }
}