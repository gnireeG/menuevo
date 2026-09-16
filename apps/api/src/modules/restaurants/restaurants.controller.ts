import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import type { Request } from 'express';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { RestaurantsService } from './restaurants.service.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { DatabaseService } from '../../database/database.service.js';
import { RestaurantResponseDto } from './dto/restaurant-response.dto.js';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @ApiCreatedResponse({ type: RestaurantResponseDto })
  create(@Body() createRestaurantDto: CreateRestaurantDto, @Session() session: UserSession, @Req() request: Request) {
    return this.restaurantsService.create(createRestaurantDto, session.user.id, request.headers);
  }

  @Get()
  @ApiOkResponse({ type: RestaurantResponseDto, isArray: true })
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Get('organization/:organizationId')
  @ApiOkResponse({ type: RestaurantResponseDto })
  byOrganization(@Param('organizationId') organizationId: string){
    return this.restaurantsService.findByOrganizationId(organizationId)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantsService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(id);
  }
}
