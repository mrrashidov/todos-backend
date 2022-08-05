import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { CreatedUserDto } from './dto/create-user.dto';
import { UserResponse } from './dto/interface'
import { UpdateUserDto } from './dto/update-user';
import { UserRole } from './entities/user-role';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) 
    private usersRepository: Repository<User>,

    private authService: AuthService
  ) { }

  getUsers(): Observable<UserResponse[]> {
    return from(this.usersRepository.find());
  }

  async getUser(id: number): Promise<UserResponse> {
    const user = await this.findUser(id);
    if (!user) {
      throw new NotFoundException('Sorry,we dont have this user.');
    }
    return user;
  }

  async remove(id: number) {
    const user = await this.findUser(id);
    if (!user) {
      throw new HttpException('User not found, please try again.', HttpStatus.NOT_FOUND);
    }
    return from(this.usersRepository.delete({ id }));
  }

  async findUser(id: number): Promise<User> {
    let user: User;
    try {
      user = await this.usersRepository.findOneBy({ id });
      return user || null;
    } catch (error) {
      return null;
    }
  }
  updateUser(updateUserDto: UpdateUserDto) {
    const exist = this.findUser(updateUserDto.id);
    if (!exist) {
      throw new HttpException('User not found, please try again.', HttpStatus.NOT_FOUND);
    } else {
      return from(this.usersRepository.update(updateUserDto.id, updateUserDto));
    }
  }

  createUserForAdmin(createdUserDto: CreatedUserDto): Observable<UserResponse> {
    return this.authService.hashPassword(createdUserDto.password).pipe(
        switchMap((passwordHash: string) => {
            const newUser = new User();
            newUser.username = createdUserDto.username;
            newUser.email = createdUserDto.email;
            newUser.password = passwordHash;
            newUser.role = UserRole.USER;
            newUser.isBlocked=false;
            return from(this.usersRepository.save(newUser)).pipe(
                map((user: UserResponse) => {
                    const {password, ...result} = user;
                    return result;
                }),
                catchError(() => throwError(error))
            )
        })
    )
}
}