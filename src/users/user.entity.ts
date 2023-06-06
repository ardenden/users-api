import { ApiProperty, PartialType, PickType } from '@nestjs/swagger'
import { User as UserModel } from '@prisma/client'

const NAME = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 50,
  PATTERN: /^(?![ .-])(?!.*[ ]$)(?!.*?[.-]{2})[a-zA-Z .-]+$/g
}
const USERNAME = {
  MIN_LENGTH: 6,
  MAX_LENGTH: 25,
  PATTERN: /^(?![0-9])(?![_.])(?!.*[_.]$)(?!.*?[_.]{2})[a-zA-Z0-9_.]+$/g
}
const PASSWORD = { MIN_LENGTH: 8 }
Object.freeze(NAME)
Object.freeze(USERNAME)
Object.freeze(PASSWORD)

export class UserEntity implements UserModel {
  constructor(partial: Partial<UserEntity | null>) {
    Object.assign(this, partial)
  }

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

export class CreateUserDto extends PickType(UserEntity, ['name', 'username', 'password'] as const) {
  @ApiProperty({
    minLength: NAME.MIN_LENGTH,
    maxLength: NAME.MAX_LENGTH,
    pattern: NAME.PATTERN.toString()
  })
  name!: string

  @ApiProperty({
    minLength: USERNAME.MIN_LENGTH,
    maxLength: USERNAME.MAX_LENGTH,
    pattern: USERNAME.PATTERN.toString()
  })
  username!: string

  @ApiProperty({ minLength: PASSWORD.MIN_LENGTH })
  password!: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  name?: string

  username?: string

  password?: string
}

