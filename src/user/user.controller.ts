import { Controller, Get, Param, Delete, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Observable } from 'rxjs/internal/Observable';
import { UserResponse } from './dto/interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }
  @Get()
  findAll(@Req() re): Observable<UserResponse[]>{
    return this.userService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
