import { Controller, Get, Param, Post, Body, Put, Delete, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto, UpdateUserDto, UserEntity } from './user.entity'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  @Get()
  async getUsers(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('search') search?: string,
    @Query('order') order?: string,
    @Query('sort') sort?: 'asc' | 'desc'
  ): Promise<UserEntity[]> {
    const users = await this.usersService.getUsers({ skip, take, search, order, sort })

    return users.map((user) => new UserEntity(user))
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<UserEntity | null> {
    const user = await this.usersService.getUserById(id)

    return user ? new UserEntity(user) : null
  }

  @Post()
  async createUser(@Body() data: CreateUserDto): Promise<UserEntity> {
    const user = await this.usersService.createUser(data)

    return new UserEntity(user)
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() data: UpdateUserDto
  ): Promise<UserEntity> {
    const user = await this.usersService.updateUser(id, data)

    return new UserEntity(user)
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<UserEntity> {
    const user = await this.usersService.deleteUser(id)

    return new UserEntity(user)
  }
}

