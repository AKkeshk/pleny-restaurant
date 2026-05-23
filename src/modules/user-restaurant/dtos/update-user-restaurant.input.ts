import { PartialType } from '@nestjs/swagger';
import { CreateUserRestaurantInput } from './create-user-restaurant.input';

export class UpdateUserRestaurantInput extends PartialType(
  CreateUserRestaurantInput,
) {}
