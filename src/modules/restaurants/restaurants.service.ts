import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Restaurant } from './schema/restaurant.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { CreateRestaurantInput } from './dtos/create-restaurant.input';
import { UpdateRestaurantInput } from './dtos/update-restaurant.input';
import { NearbyRestaurantsInput } from './dtos/nearby-restaurants.input';


@Injectable()
export class RestaurantsService {

   private readonly logger = new Logger(RestaurantsService.name);

 constructor(
 @InjectModel(Restaurant.name) private readonly restaurantModel: Model<Restaurant>,
 ) {}

    async create(input: CreateRestaurantInput): Promise<Restaurant> {
        try {
            const createdRestaurant = new this.restaurantModel(input);
            return await createdRestaurant.save();
        } catch (error) {
            this.logger.error(`Error creating restaurant: ${error.message}`);
            throw new Error('Could not create restaurant');
        }
    }
    async update(id: string, input: UpdateRestaurantInput): Promise<Restaurant> {
        try {
            const restaurant = await this.restaurantModel
                .findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, input, { new: true })
                .exec();
            if (!restaurant) {
                throw new Error(`Restaurant with id ${id} not found`);
            }           return restaurant;


        } catch (error) {
            this.logger.error(`Error updating restaurant with id ${id}: ${error.message}`);
            throw new Error('Could not update restaurant');
        }       
    }
    async findAll(): Promise<Restaurant[]> {
        try {
            return this.restaurantModel.find({ isDeleted: { $ne: true } }).exec();
        } catch (error) {
            this.logger.error(`Error finding all restaurants: ${error.message}`);
            throw new Error('Could not retrieve restaurants');
        }}
    async findOne(id: string): Promise<Restaurant> {
        try {
            const restaurant = await this.restaurantModel
                .findOne({ _id: id, isDeleted: { $ne: true } })
                .exec();
            if (!restaurant) {
                throw new Error(`Restaurant with id ${id} not found`);
            }
            return restaurant;
        } catch (error) {
            this.logger.error(`Error finding restaurant with id ${id}: ${error.message}`);
            throw new Error(`Restaurant with id ${id} not found`);
        }   }

    async findNearby(input: NearbyRestaurantsInput): Promise<Restaurant[]> {
        const longitude = Number(input.longitude);
        const latitude = Number(input.latitude);

        try {
            return this.restaurantModel
                .find({
                    isDeleted: { $ne: true },
                    location: {
                        $near: {
                            $geometry: {
                                type: 'Point',
                                coordinates: [longitude, latitude],
                            },
                            $maxDistance: 1000,
                        },
                    },
                })
                .exec();
        } catch (error) {
            this.logger.error(`Error finding nearby restaurants: ${error.message}`);
            throw new Error('Could not retrieve nearby restaurants');
        }
    }

    async softDelete(id: string): Promise<Restaurant> {
        try {
            const restaurant = await this.restaurantModel
                .findOneAndUpdate(
                    { _id: id, isDeleted: { $ne: true } },
                    { isDeleted: true, deletedAt: new Date() },
                    { new: true },
                )
                .exec();

            if (!restaurant) {
                throw new Error(`Restaurant with id ${id} not found`);
            }

            return restaurant;
        } catch (error) {
            this.logger.error(`Error deleting restaurant with id ${id}: ${error.message}`);
            throw new Error('Could not delete restaurant');
        }
    }

}
