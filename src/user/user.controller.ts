import { Controller, Get, Post, Body, Param, Delete, HttpCode, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/update-user.dto';
import { CreatedUserDto, UserResponse } from './dto/create-user.dto';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';



@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() re): Observable<UserResponse[]>{
  console.log(re.user);  
    return this.userService.findAll();
  }


  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }




}
