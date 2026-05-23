import { Module } from '@nestjs/common';
import { Restaurant, RestaurantSchema } from './schema/restaurant.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
@Module({
  imports: [MongooseModule.forFeature([{ name: Restaurant.name, schema: RestaurantSchema }])],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
})
export class RestaurantsModule {}
