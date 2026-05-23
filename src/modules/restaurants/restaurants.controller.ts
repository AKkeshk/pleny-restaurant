import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantInput } from './dtos/create-restaurant.input';
import { UpdateRestaurantInput } from './dtos/update-restaurant.input';
import { NearbyRestaurantsInput } from './dtos/nearby-restaurants.input';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Delete('deleteRestaurant/:id')
  async deleteRestaurant(@Param('id') id: string) {
    return this.restaurantsService.softDelete(id);
  }
  @Post('createRestaurant')
  @ApiBody({ type: CreateRestaurantInput })
  async createRestaurant(@Body() input: CreateRestaurantInput) {
    return this.restaurantsService.create(input);
  }
  @Patch('updateRestaurant/:id')
  @ApiBody({ type: UpdateRestaurantInput })
  async updateRestaurant(@Param('id') id: string, @Body() input: UpdateRestaurantInput) {
    return this.restaurantsService.update(id, input);
  }
  @Get('getAllRestaurants')
  async getAllRestaurants() {
    return this.restaurantsService.findAll();
  }
  @Get('nearby')
  async findNearbyRestaurants(@Query() input: NearbyRestaurantsInput) {
    return this.restaurantsService.findNearby(input);
  }
  @Get('getRestaurant/:id')
  async getRestaurant(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  } 
}
