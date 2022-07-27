import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from,  Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { UserResponse } from './dto/interface'
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) { }

  findAll(): Observable<UserResponse[]> {
    return from(this.usersRepository.find());
  }
  findOne(id: number):Observable<UserResponse>{
    return from(this.usersRepository.findOne({where: {id}}));
  }
  remove(id: number) {
    return from(this.usersRepository.delete({id}));
  }
}
