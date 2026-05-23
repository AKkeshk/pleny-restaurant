import { Injectable , Logger  } from '@nestjs/common';
import { User } from './schema/users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserInput } from './dtos/create-user.input';
import { UpdateUserInput } from './dtos/update-user.input';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

 constructor(
 @InjectModel(User.name) private readonly userModel: Model<User>,
 ) {}

  async create(input: CreateUserInput): Promise<User> {
    try {      const createdUser = new this.userModel(input);
      return await createdUser.save();
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw new Error('Could not create user');
    }
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    try {
      const user = await this.userModel
        .findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, input, { new: true })
        .exec();
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Error updating user with id ${id}: ${error.message}`);
      throw new Error(`Could not update user with id ${id}`);
    }
  }

  async findAll(): Promise<User[]> {
    try {     
         return this.userModel.find({ isDeleted: { $ne: true } }).exec();
    } catch (error) {
      this.logger.error(`Error finding all users: ${error.message}`);
      throw new Error('Could not retrieve users');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel
        .findOne({ _id: id, isDeleted: { $ne: true } })
        .exec();
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Error finding user with id ${id}: ${error.message}`);
      throw new Error(`User with id ${id} not found`);
    }
  }

  async softDelete(id: string): Promise<User> {
    try {
      const user = await this.userModel
        .findOneAndUpdate(
          { _id: id, isDeleted: { $ne: true } },
          { isDeleted: true, deletedAt: new Date() },
          { new: true },
        )
        .exec();

      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }

      return user;
    } catch (error) {
      this.logger.error(`Error deleting user with id ${id}: ${error.message}`);
      throw new Error(`Could not delete user with id ${id}`);
    }
  }
}
