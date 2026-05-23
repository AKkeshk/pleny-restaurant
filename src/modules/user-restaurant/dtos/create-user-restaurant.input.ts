import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CreateUserRestaurantInput {
  @ApiProperty({ example: '6a10a6efaaffa166907428a0' })
  @IsMongoId()
  user: string;

  @ApiProperty({ example: '6a10a6efaaffa166907428a1' })
  @IsMongoId()
  restaurant: string;
}
