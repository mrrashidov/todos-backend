import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column()
  private modelId: number;

  @Column()
  private modelType: string;

  @Column()
  private comment: string;
}
