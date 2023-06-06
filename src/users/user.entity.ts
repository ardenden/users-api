import { ApiProperty, PartialType, PickType } from '@nestjs/swagger'
import { User as UserModel } from '@prisma/client'
import { Exclude } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator'

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

  @Exclude({ toPlainOnly: true })
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
  @IsString()
  @IsNotEmpty()
  @MaxLength(NAME.MAX_LENGTH)
  @Matches(NAME.PATTERN)
  @ApiProperty({
    minLength: NAME.MIN_LENGTH,
    maxLength: NAME.MAX_LENGTH,
    pattern: NAME.PATTERN.toString()
  })
  name!: string

  @IsString()
  @IsNotEmpty()
  @MinLength(USERNAME.MIN_LENGTH)
  @MaxLength(USERNAME.MAX_LENGTH)
  @Matches(USERNAME.PATTERN)
  @ApiProperty({
    minLength: USERNAME.MIN_LENGTH,
    maxLength: USERNAME.MAX_LENGTH,
    pattern: USERNAME.PATTERN.toString()
  })
  username!: string

  @IsString()
  @IsNotEmpty()
  @MinLength(PASSWORD.MIN_LENGTH)
  @ApiProperty({ minLength: PASSWORD.MIN_LENGTH })
  password!: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  name?: string

  @IsOptional()
  username?: string

  @IsOptional()
  password?: string
}

