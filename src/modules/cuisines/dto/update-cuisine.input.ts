import { IsMongoId } from 'class-validator';
import { CreateCuisineInput } from './create-cuisine.input';
import { PartialType } from '@nestjs/swagger';

export class UpdateCuisineDto extends PartialType(CreateCuisineInput) {

  @IsMongoId()
  id: string;
}
