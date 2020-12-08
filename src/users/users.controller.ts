import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponse } from './interfaces/user.interface';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  public async getUsers(): Promise<UserResponse[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  public async getUser(@Param('id') id): Promise<UserResponse> {
    return this.usersService.findOne(id);
  }

  @Post()
  public async create(@Body() userData: CreateUserDto): Promise<UserResponse> {
    return this.usersService.create(userData);
  }

  @Patch(':id')
  public async update(
    @Param('id') id,
    @Body() userData: UpdateUserDto,
  ): Promise<UserResponse> {
    return this.usersService.update(id, userData);
  }

  @Delete(':id')
  public async delete(@Param('id') id): Promise<any> {
    return this.usersService.delete(id);
  }
}
