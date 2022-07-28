import { Injectable } from '@nestjs/common';
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
    private colorRepository: Repository<Color>
  ) { }

  async create(createLabelDto: CreateLabelDto) {
    const [color, label] = await Promise.all([
      this.colorRepository.findOne({ where: { id: createLabelDto.colorId } }),
      this.labelRepository.create({ name: createLabelDto.name })
    ])
    if (color != null) {
      label.color = color;
    }
    return from(this.labelRepository.save(label));
  }

  findAll() {
    return from(this.labelRepository.find());
  }

  findOne(id: number) {
    return from(this.labelRepository.findOne({ where: { id } }));
  }

  async update(id: number, updateLabelDto: UpdateLabelDto) {
    const [label, color] = await Promise.all([
      this.labelRepository.findOneBy({ id: id }),
      this.colorRepository.findOne({ where: { id: updateLabelDto.colorId } })
    ])
    label.color = color;
    label.name = updateLabelDto.name;
    return from(this.labelRepository.save(label));
  }

  remove(id: number) {
    return from(this.labelRepository.delete({ id }));
  }
}
