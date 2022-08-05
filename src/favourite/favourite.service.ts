import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Label } from 'src/label/entities/label.entity';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { FavouriteResponse } from './dto/favourite-interface';
import { Favourite } from './entities/favourite.entity';
import { ModelType } from './entities/model-type';

@Injectable()
export class FavouriteService {
  constructor(
    @InjectRepository(Favourite)
    private favouriteRepositoy: Repository<Favourite>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Label)
    private labelRepository: Repository<Label>,

    @InjectRepository(Project)
    private projectRepository: Repository<Project>,

  ) { }

  async create(createFavouriteDto: CreateFavouriteDto) {
    const [user, favourite] = await Promise.all([
      this.userRepository.findOne({ where: { id: createFavouriteDto.userId } }),
      this.favouriteRepositoy.create(createFavouriteDto)
    ]);
    if (user != undefined) {
      if (createFavouriteDto.modelType == ModelType.PROJECT) {
        const project = await this.projectRepository.findOne({ where: { id: createFavouriteDto.modelId }, relations: ['user'] })
        if (project != undefined && project.user == user) {
          favourite.modelId = project.id;
          favourite.modelType = ModelType.PROJECT;
        } else {
          throw new HttpException('You have not this project', HttpStatus.NOT_FOUND);
        }
      }
      if (createFavouriteDto.modelType == ModelType.LABEL) {
        const label = await this.labelRepository.findOne({ where: { id: createFavouriteDto.modelId }, relations: ['user'] })
        if (label != undefined && label.user.id == user.id) {
          favourite.modelId = label.id;
          favourite.modelType = ModelType.LABEL
        } else {
          throw new HttpException('You have not this label', HttpStatus.NOT_FOUND);
        }
      }
      favourite.user = user;
      return from(this.favouriteRepositoy.save(favourite));
    }
  }

  async findByUser(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user == null) {
      throw new HttpException(
        'Sorry,we dont have this user',
        HttpStatus.BAD_REQUEST,
      );
    }
    const favourite = this.favouriteRepositoy.query(`select f.* from favourite f join users u on u.id=f."userId"  where  "userId"=${user.id};`);
    return favourite;
  }


  async remove(id: number) {
    const label = await this.findFavourite(id);
    if (!label) {
      throw new HttpException(
        'Sorry,we dont have!!!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return from(this.favouriteRepositoy.delete({ id }));
  }

  async findFavourite(id: number): Promise<FavouriteResponse> {
    return this.favouriteRepositoy.findOneBy({ id })
      .then((res: FavouriteResponse) => res)
      .catch(err => err)
  }
}

