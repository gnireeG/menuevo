import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';
import { RestaurantResponseDto } from './dto/restaurant-response.dto.js';
import { DatabaseService } from '../../database/database.service.js';
import { restaurants } from '../../database/schema/restaurant.schema.js';
import { organization } from '../../database/schema/auth.schema.js';
import { auth } from '../../auth/auth.js';
import { APIError } from 'better-auth/api';
import { fromNodeHeaders } from 'better-auth/node';
import { slugify } from '../../lib/utils.js';
import { eq } from 'drizzle-orm';
import type { IncomingHttpHeaders } from 'http';

@Injectable()
export class RestaurantsService {

  private auth = auth

  constructor(private readonly database: DatabaseService){}

  async create(createRestaurantDto: CreateRestaurantDto, userId: string, headers: IncomingHttpHeaders) {

    const slug = slugify(createRestaurantDto.name)

    const restaurantSlugCheck = await this.findBySlug(slug)

    if(restaurantSlugCheck){
      throw new ConflictException({
        message: `Restaurant with slug "${slug}" already exists`,
      })
    }

    try {
      await this.auth.api.checkOrganizationSlug({ body: { slug } })
    } catch (error) {
      if (error instanceof APIError) {
        throw new ConflictException({
          message: `Restaurant with slug "${slug}" already exists`,
        })
      }
      throw error
    }

    const org = await this.auth.api.createOrganization({
      body: { name: createRestaurantDto.name, slug, userId }
    })

    if (!org) {
      throw new ConflictException({
        message: `Restaurant with slug "${slug}" already exists`,
      })
    }

    try {
      const newRestaurant =  await this.database.db.insert(restaurants).values({...createRestaurantDto, organizationId: org.id, owner_id: userId}).returning()
      await auth.api.setActiveOrganization({
        body: {
          organizationId: org.id,
        },
        headers: fromNodeHeaders(headers),
      })
    } catch (error) {
        await this.database.db.delete(organization).where(eq(organization.id, org.id))
        throw error
    }
  }

  async findAll(): Promise<RestaurantResponseDto[]> {
    const rows = await this.database.db.query.restaurants.findMany()
    return rows
  }

  async findOne(id: string) {
    return await this.database.db.query.restaurants.findFirst({
      where: eq(restaurants.id, id)
    })
  }

  async findBySlug(slug: string){
    return await this.database.db.query.restaurants.findFirst({
      where: eq(restaurants.slug, slug)
    })
  }

  update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    return `This action updates a #${id} restaurant`;
  }

  remove(id: string) {
    return `This action removes a #${id} restaurant`;
  }
}
