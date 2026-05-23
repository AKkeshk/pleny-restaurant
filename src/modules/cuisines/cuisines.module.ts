import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CuisinesController } from './cuisines.controller';
import { CuisinesService } from './cuisines.service';
import { Cuisine, CuisineSchema } from './schema/cuisines.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cuisine.name, schema: CuisineSchema }])],
  controllers: [CuisinesController],
  providers: [CuisinesService],
})
export class CuisineModule {}
