import { ModelType } from 'src/enum/model-type';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  modelId: number;

  @Column({ type: 'enum', enum: ModelType })
  modelType: ModelType;

  @Column()
  text: string;

  @JoinColumn()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  user: User;

  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  createdAt: Date;
 }
