import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {UsersService} from "./users.service";
import { CreateUserInput } from './dtos/create-user.input';
import { UpdateUserInput } from './dtos/update-user.input';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('getUser/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  @Post('createUser')
  @ApiBody({ type: CreateUserInput })
  async createUser(@Body() input: CreateUserInput) {
    return this.userService.create(input);
  }
  @Patch('updateUser/:id')
  @ApiBody({ type: UpdateUserInput })
  async updateUser(@Param('id') id: string, @Body() input: UpdateUserInput) {
    return this.userService.update(id, input);
  }
  @Get('getAllUsers')
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Delete('deleteUser/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.softDelete(id);
  }
}
