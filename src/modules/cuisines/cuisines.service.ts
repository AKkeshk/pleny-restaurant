import { Injectable, Logger } from '@nestjs/common';
import { Cuisine } from './schema/cuisines.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateCuisineDto } from './dto/update-cuisine.input';
import { CreateCuisineInput } from './dto/create-cuisine.input';

@Injectable()
export class CuisinesService {

private readonly logger = new Logger(CuisinesService.name);
    
 constructor(
     @InjectModel(Cuisine.name) private readonly cuisineModel: Model<Cuisine>,
     ) {}

    async findAll(): Promise<Cuisine[]> {
        try {
            return this.cuisineModel.find({ isDeleted: { $ne: true } }).exec();
        } catch (error) {
            this.logger.error(`Error finding all cuisines: ${error.message}`);
            throw new Error('Could not retrieve cuisines');
        }
    }
        async findOne(id: string): Promise<Cuisine> {
            try {
                const cuisine = await this.cuisineModel
                    .findOne({ _id: id, isDeleted: { $ne: true } })
                    .exec();
                if (!cuisine) {
                    throw new Error(`Cuisine with id ${id} not found`);
                }
                return cuisine;
            } catch (error) {
                this.logger.error(`Error finding cuisine with id ${id}: ${error.message}`);
                throw new Error(`Cuisine with id ${id} not found`);
            }   
 

        }

    async create(input: CreateCuisineInput): Promise<Cuisine> {
        try {
            const createdCuisine = new this.cuisineModel(input);
            return await createdCuisine.save();
        } catch (error) {
            this.logger.error(`Error creating cuisine: ${error.message}`);
            throw new Error('Could not create cuisine');
        }
    }
    async update(id: string, input: UpdateCuisineDto): Promise<Cuisine> {
        try {
            const cuisine = await this.cuisineModel
                .findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, input, { new: true })
                .exec();
            if (!cuisine) {
                throw new Error(`Cuisine with id ${id} not found`);
            }
            return cuisine;
        } catch (error) {
            this.logger.error(`Error updating cuisine with id ${id}: ${error.message}`);
            throw new Error('Could not update cuisine');
        }
    }

    async softDelete(id: string): Promise<Cuisine> {
        try {
            const cuisine = await this.cuisineModel
                .findOneAndUpdate(
                    { _id: id, isDeleted: { $ne: true } },
                    { isDeleted: true, deletedAt: new Date() },
                    { new: true },
                )
                .exec();

            if (!cuisine) {
                throw new Error(`Cuisine with id ${id} not found`);
            }

            return cuisine;
        } catch (error) {
            this.logger.error(`Error deleting cuisine with id ${id}: ${error.message}`);
            throw new Error('Could not delete cuisine');
        }
    }
}
