import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { Repository } from 'typeorm/repository/Repository';
import { ColorResponse } from './dto/color-interface';
import { CreateColorDto } from './dto/create-color.dto';
import { Color } from './entities/color.entity';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private colorRepository: Repository<Color>,
  ) {}

  create(createColorDto: CreateColorDto): Observable<ColorResponse> {
    const newColor = this.colorRepository.create(createColorDto);
    return from(this.colorRepository.save(newColor)).pipe(
      map((color: ColorResponse) => color ),
    );
  }

  findAll(): Observable<ColorResponse[]> {
    return from(this.colorRepository.find()).pipe(
      map((colors: ColorResponse[]) => colors.map(color => ({name:color.name})),
    ));
  }

   remove(id: number) {
    const color = this.findColor(id);
    if (!color) {
      throw new HttpException(
        'Sorry,we dont have this color',
        HttpStatus.BAD_REQUEST,
      );
    }
    return from(this.colorRepository.delete({ id })).pipe(
      catchError((err) => of({ error: err.message })),
    );
  }

  async findColor(id: number): Promise<ColorResponse> {
    return this.colorRepository.findOneBy({ id })
    .then((res : ColorResponse) => res)
    .catch(err => err)
   }
}
