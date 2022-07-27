import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable} from 'rxjs';
import { Repository } from 'typeorm';
import { UserResponse } from './dto/interface'
import { UpdateUserDto } from './dto/update-user';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) { }

  getUsers(): Observable<UserResponse[]> {
    return from(this.usersRepository.find());
  }

  getUser(id: number): Observable<UserResponse> {
    return from(this.usersRepository.findOne({ where: { id } }));
  }

  remove(id: number) {
    return from(this.usersRepository.delete({ id }));
  }

  updateUser(updateUserDto: UpdateUserDto) {
    const exist = this.userExists(updateUserDto.id);
    if (!exist) {
      throw new HttpException('User not found, please try again.', HttpStatus.NOT_FOUND);
    } else {
      return from(this.usersRepository.update(updateUserDto.id, updateUserDto));
    }
  }

  private userExists(id: number): Observable<boolean> {
    return from(this.usersRepository.findOne({ where: { id } })).pipe(
      map((user: UserResponse) => {
        return !user
      })
    )
  }
}