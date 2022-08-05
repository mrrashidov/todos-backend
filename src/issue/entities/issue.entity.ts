import { Color } from 'src/color/entities/color.entity';
import { Label } from 'src/label/entities/label.entity';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { IssueStatus } from 'src/enum/IssueStatus';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Priority } from 'src/enum/IssuePriority.enum';

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => Issue)
  parentIssue: Issue;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: IssueStatus })
  status: IssueStatus;

  @Column({ type: 'enum', enum: Priority })
  priority: Priority;

  @Column('timestamp with time zone')
  dueDate: Date;

  @JoinColumn()
  @ManyToOne(() => Project, (project) => project.issue)
  project: Project;

  @ManyToOne(() => Color)
  @JoinColumn()
  colors: Color;

  @JoinColumn()
  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  createdAt: Date;

  @ManyToMany(() => Label)
  @JoinTable()
  labels: Label[];
}
