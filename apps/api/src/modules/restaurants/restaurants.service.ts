import { Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';
import { RestaurantResponseDto } from './dto/restaurant-response.dto.js';
import { DatabaseService } from '../../database/database.service.js';
import { restaurants } from '../../database/schema/restaurant.schema.js';

@Injectable()
export class RestaurantsService {

  constructor(private readonly database: DatabaseService){}

  async create(createRestaurantDto: CreateRestaurantDto) {
    return await this.database.db.insert(restaurants).values(createRestaurantDto).returning()
  }

  async findAll(): Promise<RestaurantResponseDto[]> {
    const rows = await this.database.db.query.restaurants.findMany()
    return rows
  }

  findOne(id: string) {
    return `This action returns a #${id} restaurant`;
  }

  update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    return `This action updates a #${id} restaurant`;
  }

  remove(id: string) {
    return `This action removes a #${id} restaurant`;
  }
}
