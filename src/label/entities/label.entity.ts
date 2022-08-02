import { type } from 'os';
import { Color } from 'src/color/entities/color.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Label {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @JoinColumn()
  @ManyToOne(() => Color, {
    onDelete: 'SET NULL',
  })
  color: Color;

  @JoinColumn()
  @ManyToOne(type=> User,user=>user.labels, {
    onDelete: 'SET NULL',
  })
  user: User;
}
