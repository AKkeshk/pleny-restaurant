import { IsMongoId } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantInput } from './create-restaurant.input';

export class UpdateRestaurantInput extends PartialType(CreateRestaurantInput) {

  @IsMongoId()
  id: string;
}
