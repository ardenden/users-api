import { ApiProperty } from '@nestjs/swagger'
import { User as UserModel } from '@prisma/client'

export class UserEntity implements UserModel {
  @ApiProperty({
    example: 1,
    readOnly: true,
    required: false
  })
  id!: number

  @ApiProperty({ example: 'Arden' })
  name!: string

  @ApiProperty({ example: 'arden69' })
  username!: string

  @ApiProperty({
    example: 'iHate_javascript',
    writeOnly: true
  })
  password!: string

  @ApiProperty({
    readOnly: true,
    required: false
  })
  createdAt!: Date

  @ApiProperty({
    readOnly: true,
    required: false
  })
  updatedAt!: Date
}

