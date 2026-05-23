import { IsMongoId } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateUserInput } from './create-user.input';

export class UpdateUserInput extends PartialType(CreateUserInput) {

  @IsMongoId()
  id: string;
}
