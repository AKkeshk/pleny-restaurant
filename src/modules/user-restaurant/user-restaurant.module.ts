import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserRestaurant,
  UserRestaurantSchema,
} from './schema/user-restaurant.schema';
import { Restaurant, RestaurantSchema } from '../restaurants/schema/restaurant.schema';
import { User, UserSchema } from '../users/schema/users.schema';
import { UserRestaurantController } from './user-restaurant.controller';
import { UserRestaurantService } from './user-restaurant.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserRestaurant.name, schema: UserRestaurantSchema },
      { name: User.name, schema: UserSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
  controllers: [UserRestaurantController],
  providers: [UserRestaurantService],
})
export class UserRestaurantModule {}
