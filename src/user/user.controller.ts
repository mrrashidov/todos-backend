import { Controller, Get, Param, Delete, Req, Put, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Observable } from 'rxjs/internal/Observable';
import { UserResponse } from './dto/interface';
import { UpdateUserDto } from './dto/update-user';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }


  @Get()
  getAllUsers(@Req() re): Observable<UserResponse[]> {
    return this.userService.getUsers();
  }
  @Get(':userId')
  getUser(@Param('userId') userId: number) {
    return this.userService.getUser(+userId);
  }
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(+id);
  }

  @Put()
  updateUser(
    @Body() updateUserDto: UpdateUserDto){
    return this.userService.updateUser( updateUserDto);
  }
}
