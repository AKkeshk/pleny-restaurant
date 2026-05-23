import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from './modules/users/users.module';
import { CuisineModule } from './modules/cuisines/cuisines.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { UserRestaurantModule } from './modules/user-restaurant/user-restaurant.module';

@Module({
  imports: [ 
    MongooseModule.forRoot(
      process.env.MONGO_URI ??
        (() => {
          throw new Error("MONGO_URI environment variable is not defined");
        })(),
    ),
    UsersModule,
    CuisineModule,
    RestaurantsModule,
    UserRestaurantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
