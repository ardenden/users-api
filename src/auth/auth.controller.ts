import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AccessToken, SignInUserDto } from 'src/users/user.entity'
import { Public } from './auth.decorator'
import { ApiTags } from '@nestjs/swagger'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Public()
  signIn(@Body() data: SignInUserDto): Promise<AccessToken> {
    return this.authService.signIn(data)
  }
}

