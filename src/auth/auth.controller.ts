import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { CreatedUserDto } from 'src/user/dto/create-user.dto';
import { UserResponse } from 'src/user/dto/interface';
import { LoginDto } from 'src/user/dto/update-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() loginUserDto: LoginDto): Observable<Object> {
    return this.authService.login(loginUserDto).pipe(
      map((jwt: string) => {
        return {
          access_token: jwt,
          token_type: process.env.TOKEN_TYPE,
          expires_in: process.env.EXPIRES_IN,
        };
      }),
    );
  }
  @Post()
  @HttpCode(200)
  register(@Body() createdUserDto: CreatedUserDto): Observable<UserResponse> {
    return this.authService.register(createdUserDto);
  }
}
