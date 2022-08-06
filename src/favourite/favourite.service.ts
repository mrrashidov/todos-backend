import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, switchMap } from 'rxjs';
import { Label } from 'src/label/entities/label.entity';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { Favourite } from './entities/favourite.entity';
import { ModelType } from '../enum/model-type';

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
    if (user) {
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
  remove(id: number) {
    return from(this.findFavourite(id)
      .then((favourite: Favourite) => favourite)
      .catch(error => error));
  }
  findFavouriteByUserId(userId: number, modelType: ModelType): Observable<Favourite[]> {
    const user = this.userRepository.findOne({ where: { id: userId } });
    return from(this.favouriteRepositoy.find({ where: { user: user as any, modelType: modelType } }));
  }

  findUserById(id: number): Observable<User> {
    return from(this.userRepository.findOneBy({ id }))
  }

  async findFavourite(id: number): Promise<Favourite> {
    return this.favouriteRepositoy.findOneBy({ id })
      .then((res: Favourite) => res)
      .catch(err => err)
  }
}

