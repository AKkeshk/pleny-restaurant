import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Restaurant } from '../restaurants/schema/restaurant.schema';
import { User } from '../users/schema/users.schema';
import { CreateUserRestaurantInput } from './dtos/create-user-restaurant.input';
import { UpdateUserRestaurantInput } from './dtos/update-user-restaurant.input';
import { UserRestaurant } from './schema/user-restaurant.schema';

@Injectable()
export class UserRestaurantService {
  private readonly logger = new Logger(UserRestaurantService.name);

  constructor(
    @InjectModel(UserRestaurant.name)
    private readonly userRestaurantModel: Model<UserRestaurant>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<Restaurant>,
  ) {}

  async create(input: CreateUserRestaurantInput): Promise<UserRestaurant> {
    try {
      const relation = new this.userRestaurantModel(input);
      return relation.save();
    } catch (error) {
      this.logger.error(`Error creating user restaurant relation: ${error.message}`);
      throw new Error('Could not create user restaurant relation');
    }
  }

  async findAll(): Promise<UserRestaurant[]> {
    try {
      return this.userRestaurantModel
        .find({ isDeleted: { $ne: true } })
        .populate('user')
        .populate('restaurant')
        .exec();
    } catch (error) {
      this.logger.error(`Error finding user restaurant relations: ${error.message}`);
      throw new Error('Could not retrieve user restaurant relations');
    }
  }

  async findOne(id: string): Promise<UserRestaurant> {
    try {
      const relation = await this.userRestaurantModel
        .findOne({ _id: id, isDeleted: { $ne: true } })
        .populate('user')
        .populate('restaurant')
        .exec();

      if (!relation) {
        throw new Error(`User restaurant relation with id ${id} not found`);
      }

      return relation;
    } catch (error) {
      this.logger.error(
        `Error finding user restaurant relation with id ${id}: ${error.message}`,
      );
      throw new Error(`User restaurant relation with id ${id} not found`);
    }
  }

  async update(
    id: string,
    input: UpdateUserRestaurantInput,
  ): Promise<UserRestaurant> {
    try {
      const relation = await this.userRestaurantModel
        .findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, input, { new: true })
        .populate('user')
        .populate('restaurant')
        .exec();

      if (!relation) {
        throw new Error(`User restaurant relation with id ${id} not found`);
      }

      return relation;
    } catch (error) {
      this.logger.error(
        `Error updating user restaurant relation with id ${id}: ${error.message}`,
      );
      throw new Error('Could not update user restaurant relation');
    }
  }

  async getRestaurantRecommendations(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user id');
    }

    const userObjectId = new Types.ObjectId(userId);

    const [user] = await this.userModel
      .aggregate([
        {
          $match: {
            _id: userObjectId,
            isDeleted: { $ne: true },
          },
        },
        {
          $project: {
            favoriteCuisines: 1,
          },
        },
      ])
      .exec();

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const users = await this.userModel
      .aggregate([
        {
          $match: {
            _id: { $ne: userObjectId },
            isDeleted: { $ne: true },
            favoriteCuisines: { $in: user.favoriteCuisines ?? [] },
          },
        },
        {
          $project: {
            fullName: 1,
            favoriteCuisines: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ])
      .exec();

    const userIds = users.map((item) => item._id);
    const userIdsAsString = userIds.map((id) => id.toString());

    const followedRestaurants = await this.userRestaurantModel
      .aggregate([
        {
          $match: {
            isDeleted: { $ne: true },
            $expr: {
              $in: [{ $toString: '$user' }, userIdsAsString],
            },
          },
        },
        {
          $group: {
            _id: null,
            restaurantIds: { $addToSet: { $toString: '$restaurant' } },
          },
        },
      ])
      .exec();

    const restaurantIds = followedRestaurants[0]?.restaurantIds ?? [];

    const restaurants = await this.restaurantModel
      .aggregate([
        {
          $match: {
            isDeleted: { $ne: true },
            $expr: {
              $in: [{ $toString: '$_id' }, restaurantIds],
            },
          },
        },
      ])
      .exec();

    return { users, restaurants };
  }
}
