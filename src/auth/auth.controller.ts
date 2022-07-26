
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { CreatedUserDto, UserResponse } from 'src/user/dto/create-user.dto';
import { LoginDto } from 'src/user/dto/update-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(200)
    login(@Body() loginUserDto: LoginDto): Observable<Object> {
      
      return this.authService.login(loginUserDto).pipe(
        map((jwt: string) => {
          return {
            access_token: jwt,
            token_type: 'JWT',
            expires_in: 1000
          }
        })
      );
    }

  
    @Post()
    @HttpCode(200)
    register(@Body() createdUserDto: CreatedUserDto): Observable<UserResponse> {
      return this.authService.register(createdUserDto);
    }

 }
