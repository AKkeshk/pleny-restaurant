import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsLatitude,
  IsLongitude,
  IsMongoId,
  IsNotEmpty,
  IsInt,
  IsString,
  ValidateNested,
  IsIn,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class RestaurantNameDto {
  @ApiProperty({ example: 'Pasta House' })
  @IsString()
  @IsNotEmpty()
  en: string;

  @ApiProperty({ example: 'بيت الباستا' })
  @IsString()
  @IsNotEmpty()
  ar: string;
}

class LocationDto {
  @ApiProperty({ example: 'Point' })
  @IsIn(['Point'])
  type: 'Point';

  @ApiProperty({ example: [31.2357, 30.0444] })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  coordinates: [number, number];

  @IsLongitude()
  get longitude(): number {
    return this.coordinates?.[0];
  }

  @IsLatitude()
  get latitude(): number {
    return this.coordinates?.[1];
  }
}

export class CreateRestaurantInput {
    @ApiProperty({ type: RestaurantNameDto })
    @ValidateNested()
    @Type(() => RestaurantNameDto)
    name: RestaurantNameDto;

    @ApiProperty({ type: LocationDto })
    @ValidateNested()
    @Type(() => LocationDto)
    location: LocationDto;

    @ApiProperty({
        example: ['6650f1f2a9b3c4d5e6f78901'],
        type: [String],
    })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(3)
    @IsMongoId({ each: true })
    cuisines: string[]

    @ApiProperty({ example: 1998 })
    @Type(() => Number)
    @IsInt()
    yearFounded: number;
}
