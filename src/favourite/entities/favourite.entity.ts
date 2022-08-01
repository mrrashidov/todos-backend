import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Favourite {
  @PrimaryGeneratedColumn()
  private id: number;

  @JoinColumn()
  @ManyToOne(() => User)
  private user: User;

  @JoinColumn()
  @ManyToOne(() => Project)
  private project: Project;
}
