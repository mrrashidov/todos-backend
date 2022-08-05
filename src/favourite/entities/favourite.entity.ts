import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ModelType } from './model-type';

@Entity()
export class Favourite {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  user: User;

  @Column()
  modelId: number;

  @Column({ type: 'enum', enum: ModelType  })
  modelType: ModelType;
}
