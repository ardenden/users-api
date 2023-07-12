import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AccessToken, SignInUserDto } from 'src/users/user.entity'
import { UsersService } from 'src/users/users.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn(data: SignInUserDto): Promise<AccessToken> {
    const user = await this.usersService.getUserByUsername(data.username)
    const isMatch = await bcrypt.compare(data.password, user.password)

    if (!isMatch) throw new UnauthorizedException()

    const payload = {
      sub: user.id, username: user.username
    }

    return { access_token: await this.jwtService.signAsync(payload) }
  }
}

