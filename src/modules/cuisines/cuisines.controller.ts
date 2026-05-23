import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CuisinesService } from './cuisines.service';
import { CreateCuisineInput } from './dto/create-cuisine.input';
import { UpdateCuisineDto } from './dto/update-cuisine.input';

@ApiTags('cuisines')
@Controller('cuisines')
export class CuisinesController {
  constructor(private readonly cuisinesService: CuisinesService) {}

  @Get('getAllCuisines')
  async getAllCuisines() {
    return this.cuisinesService.findAll();
  } 
  @Get('getCuisine/:id')
  async getCuisine(@Param('id') id: string) {
    return this.cuisinesService.findOne(id);
  }

  @Post('createCuisine')
  @ApiBody({ type: CreateCuisineInput })
  async createCuisine(@Body() input: CreateCuisineInput) {
    return this.cuisinesService.create(input);
  }
  @Patch('updateCuisine/:id')
  @ApiBody({ type: UpdateCuisineDto })
  async updateCuisine(@Param('id') id: string, @Body() input: UpdateCuisineDto) {
    return this.cuisinesService.update(id, input);
  }

  @Delete('deleteCuisine/:id')
  async deleteCuisine(@Param('id') id: string) {
    return this.cuisinesService.softDelete(id);
  }
  

}

