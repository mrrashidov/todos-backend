import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from} from 'rxjs';
import { Repository } from 'typeorm/repository/Repository';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Color } from './entities/color.entity';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private colorRepository: Repository<Color>
  ) { }

  async create(createColorDto: CreateColorDto) {
    const newColor = this.colorRepository.create(createColorDto);
    await this.colorRepository.save(newColor);
    return newColor;
  }

  findAll() {
    return from(this.colorRepository.find());
  }

  async findOne(id: number) {
    const color = await this.findColor(id);
    if(!color){
      throw new NotFoundException('Sorry , we dont have this color');
    }
    return color;
  }

  async update(updateColorDto: UpdateColorDto) {
    const color = await this.findColor(updateColorDto.id);
    if(!color){
      throw new HttpException('Sorry,we dont have this color', HttpStatus.BAD_REQUEST);
    }
    return from(this.colorRepository.update(updateColorDto.id,updateColorDto));
  }

  async remove(id: number) {
    const color = await this.findColor(id);
    if(!color){
      throw new HttpException('Sorry,we dont have this color', HttpStatus.BAD_REQUEST);
    }
    return from(this.colorRepository.delete({ id }));
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
