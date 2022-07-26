import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, switchMap } from 'rxjs';
import { CreatedUserDto, UserResponse } from 'src/user/dto/create-user.dto';
import { LoginDto } from 'src/user/dto/update-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) { }

  
  register(createdUserDto: CreatedUserDto): Observable<UserResponse> {
    const userEntity = this.usersRepository.create(createdUserDto);

    return this.mailExists(userEntity.email).pipe(
      switchMap((exists: boolean) => {
        if (!exists) {
          return this.hashPassword(userEntity.password).pipe(
            switchMap((passwordHash: string) => {
              userEntity.password = passwordHash;
              return from(this.usersRepository.save(userEntity)).pipe(
                map((savedUser: UserResponse) => {
                  const { password, ...user } = savedUser;
                  return user;
                })
              )
            })
          )
        } else {
          throw new HttpException('Email already in use', HttpStatus.CONFLICT);
        }
      })
    )
  }

  login(loginUserDto: LoginDto): Observable<string> {
    return this.findUserByEmail(loginUserDto.email.toLowerCase()).pipe(
      switchMap((user: UserResponse) => {
        
        if (user) {  
          return this.validatePassword(loginUserDto.password, user.password).pipe(
            switchMap((passwordsMatches: boolean) => {
              if (passwordsMatches) {
              
                
                return this.findOne(user.id).pipe(
                  switchMap((user: UserResponse) => this.generateJwt(user))
                )
              } else {
                throw new HttpException('Login was not Successfulll', HttpStatus.UNAUTHORIZED);
              }
            })
          )
        } else {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
      }
      )
    )
  }

  findAll(): Observable<UserResponse[]> {
    return from(this.usersRepository.find());
  }

  findOne(id: number): Observable<UserResponse> {
    return from(this.usersRepository.findOne({ where:{id} }));
  }

  private findUserByEmail(email: string): Observable<UserResponse> {
 return from(this.usersRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'password', 'avatar']
    }));;
  }

  private validatePassword(password: string, storedPasswordHash: string): Observable<boolean> {
    return  this.comparePasswords(password, storedPasswordHash);
  }

  private mailExists(email: string): Observable<boolean> {
    email = email.toLowerCase();
    return from(this.usersRepository.findOne({ where:{email} })).pipe(
      map((user: UserResponse) => {
        if (user) {
          return true;
        } else {
          return false;
        }
      })
    )
  }

  generateJwt(user: UserResponse): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }

  hashPassword(password: string): Observable<string> {
    console.log(password);
    
    return from<string>(bcrypt.hash(password, 12));
  }

  comparePasswords(password: string, storedPasswordHash: string): Observable<any> { 
    return from(bcrypt.compare(password, storedPasswordHash));
  }



 



}


