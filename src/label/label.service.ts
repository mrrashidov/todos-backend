import {
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable } from 'rxjs';
import { Color } from 'src/color/entities/color.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateLabelDto } from './dto/create-label.dto';
import { LabelResponse } from './dto/label-interface';
import { UpdateLabelDto } from './dto/update-label.dto';
import { Label } from './entities/label.entity';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,

    @InjectRepository(Color)
    private colorRepository: Repository<Color>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(createLabelDto: CreateLabelDto) {
    const [color, user, label] = await Promise.all([
      this.colorRepository.findOne({ where: { id: createLabelDto.colorId } }),
      this.userRepository.findOne({ where: { id: createLabelDto.userId } }),
      this.labelRepository.create({ name: createLabelDto.name }),
    ]);
    if (color != null && user != null) {
      label.user = user;
      label.color = color;
      label.name = createLabelDto.name;
    }
    return from(this.labelRepository.save(label));
  }

  async findByUser(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user == null) {
      throw new HttpException(
        'Sorry,we dont have this label',
        HttpStatus.BAD_REQUEST,
      );
    }
    const label = this.labelRepository.query(`select l.name as label ,u.username as user , c.name as color from label l join users u on u.id=l."userId" join color c on c.id=l."colorId"  where  "userId"=${user.id};`);
    return label;
  }

  findAllForAdmin(): Observable<LabelResponse[]> {
    return from(this.labelRepository.find({ relations: ['user', 'color'] }));
  }
  async findLabel(id: number): Promise<LabelResponse> {
    return this.labelRepository.findOneBy({ id })
      .then((res: LabelResponse) => res)
      .catch(err => err)
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
