import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude } from 'class-validator';
import { Type } from 'class-transformer';

export class NearbyRestaurantsInput {
  @ApiProperty({ example: 31.2357 })
  @Type(() => Number)
  @IsLongitude()
  longitude: number;

  @ApiProperty({ example: 30.0444 })
  @Type(() => Number)
  @IsLatitude()
  latitude: number;
}
