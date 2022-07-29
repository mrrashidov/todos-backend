import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, of, switchMap} from 'rxjs';
import { Repository } from 'typeorm/repository/Repository';
import { ColorI } from './dto/color-interface';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Color } from './entities/color.entity';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private colorRepository: Repository<Color>
  ) { }

  create(createColorDto: CreateColorDto): Observable<ColorI> {
    const newColor = this.colorRepository.create(createColorDto);
    return from(this.colorRepository.save(newColor)).pipe(
      map((color:ColorI)=>{
        const{...result}=color;
        return result;
      })      
    );
  }

  findAll(): Observable<ColorI[]> {
    return from(this.colorRepository.find()).pipe(
      map((colors: ColorI[]) => {
        colors.forEach(function (v) { delete v.id });
        return colors;
      })
    );
  }

  findOne(id: number): Observable<ColorI> {
    return from(this.findColor(id)).pipe(
      map((color: ColorI) => {
        const { ...result } = color;
        return result;
      })
    )
  }

  update(id: number, updateColorDto: UpdateColorDto): Observable<ColorI> {
    return from(this.colorRepository.update(id, updateColorDto)).pipe(
      switchMap(() => this.findOne(id))
    );
  }

  remove(id: number) {
    const color = this.findColor(id);
    if (!color) {
      throw new HttpException('Sorry,we dont have this color', HttpStatus.BAD_REQUEST);
    }
      return from(this.colorRepository.delete({ id })).pipe(
        catchError(err =>of({error:err.message}))
      )
  }

  async findColor(id: number): Promise<Color> {
    let color: Color;
    try {
      color = await this.colorRepository.findOneBy({ id });
      return color || null;
    } catch (error) {
      return null;
    }
  }
}
