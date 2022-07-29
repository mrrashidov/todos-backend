import { Controller, Get, Param, Delete, Req, Put, Body, UseGuards, Post, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { Observable } from 'rxjs/internal/Observable';
import { UserResponse } from './dto/interface';
import { UpdateUserDto } from './dto/update-user';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageResponse } from './dto/image-interface';
import { catchError, map, of } from 'rxjs';
import { diskStorage } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CreatedUserDto } from './dto/create-user.dto';

export const storage = {
  storage: diskStorage({
    destination: './uploads/images',
    filename: (requ, file, cb) => {
      const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`)
    }
  })

}

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }


  @Post()
  createUserForAdmin(@Body() createUser: CreatedUserDto): Observable<UserResponse | Object> {
    return this.userService.createUserForAdmin(createUser).pipe(
      map((user: UserResponse) => user),
      catchError(err => of({ error: err.message }))
    );
  }

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
    @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('image/upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() requ): Observable<ImageResponse> {
    return of(file);
  }
}
