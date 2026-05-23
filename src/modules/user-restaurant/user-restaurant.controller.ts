import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUserRestaurantInput } from './dtos/create-user-restaurant.input';
import { UpdateUserRestaurantInput } from './dtos/update-user-restaurant.input';
import { UserRestaurantService } from './user-restaurant.service';

@ApiTags('user-restaurants')
@Controller('user-restaurants')
export class UserRestaurantController {
  constructor(
    private readonly userRestaurantService: UserRestaurantService,
  ) {}

  @Post('createUserRestaurant')
  @ApiBody({ type: CreateUserRestaurantInput })
  async createUserRestaurant(@Body() input: CreateUserRestaurantInput) {
    return this.userRestaurantService.create(input);
  }

  @Get('getAllUserRestaurants')
  async getAllUserRestaurants() {
    return this.userRestaurantService.findAll();
  }

  @Get('recommendations/:userId')
  @ApiParam({ name: 'userId', example: '6a10a6efaaffa166907428a0' })
  async getRestaurantRecommendations(@Param('userId') userId: string) {
    return this.userRestaurantService.getRestaurantRecommendations(userId);
  }

  @Get('getUserRestaurant/:id')
  async getUserRestaurant(@Param('id') id: string) {
    return this.userRestaurantService.findOne(id);
  }

  @Patch('updateUserRestaurant/:id')
  @ApiBody({ type: UpdateUserRestaurantInput })
  async updateUserRestaurant(
    @Param('id') id: string,
    @Body() input: UpdateUserRestaurantInput,
  ) {
    return this.userRestaurantService.update(id, input);
  }
}
