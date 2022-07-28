import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
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
}