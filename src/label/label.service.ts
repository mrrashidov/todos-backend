import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { Color } from 'src/color/entities/color.entity';
import { Repository } from 'typeorm';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { Label } from './entities/label.entity';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,

    @InjectRepository(Color)
    private colorRepository: Repository<Color>,
  ) {}

  async create(createLabelDto: CreateLabelDto) {
    const [color, label] = await Promise.all([
      this.colorRepository.findOne({ where: { id: createLabelDto.colorId } }),
      this.labelRepository.create({ name: createLabelDto.name }),
    ]);
    if (color != null) {
      label.color = color;
    }
    return from(this.labelRepository.save(label));
  }

  findAll() {
    return from(this.labelRepository.find());
  }

  async findLabel(id: number): Promise<Label> {
    let label: Label;
    try {
      label = await this.labelRepository.findOneBy({ id });
      return label || null;
    } catch (error) {
      return null;
    }
  }

  async findOne(id: number) {
    const label = await this.findLabel(id);
    if (!label) {
      throw new NotFoundException('Sorry,we dont have this label.');
    }
    return label;
  }

  async update(id: number, updateLabelDto: UpdateLabelDto) {
    const current = await this.findLabel(id);
    if (!current) {
      throw new HttpException(
        'Sorry,we dont have this label',
        HttpStatus.BAD_REQUEST,
      );
    }
    const [label, color] = await Promise.all([
      this.labelRepository.findOneBy({ id }),
      this.colorRepository.findOne({ where: { id: updateLabelDto.colorId } }),
    ]);
    label.color = color;
    label.name = updateLabelDto.name;
    return from(this.labelRepository.save(label));
  }

  async remove(id: number) {
    const label = await this.findLabel(id);
    if (!label) {
      throw new HttpException(
        'Sorry,we dont have this label',
        HttpStatus.BAD_REQUEST,
      );
    }
    return from(this.labelRepository.delete({ id }));
  }
}
