import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { User, Prisma } from '@prisma/client'
import { hashPassword } from 'src/utils/string.utils'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async getUsers(query: {
    skip?: number
    take?: number
    search?: string
    order?: string
    sort?: 'asc' | 'desc'
  }): Promise<User[]> {
    const { skip, take, search, order, sort } = query

    return this.prisma.user.findMany({
      skip: Number(skip) || undefined,
      take: Number(take) || undefined,
      where: search ? {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            username: {
              contains: search,
              mode: 'insensitive'
            }
          }
        ]
      } : undefined,
      orderBy: order ? { [<string>order]: sort || 'asc' } : undefined
    })
  }

  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: Number(id) }
    })
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    data.password = await hashPassword(data.password)

    return this.prisma.user.create({ data })
  }

  async updateUser(
    id: number,
    data: Prisma.UserUpdateInput
  ): Promise<User> {
    if (data.password && typeof data.password === 'string') {
      data.password = await hashPassword(data.password)
    }

    return this.prisma.user.update({
      where: { id: Number(id) },
      data
    })
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id: Number(id) }
    })
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { username: username }
    })

    if (!user) throw new NotFoundException()

    return user
  }
}

