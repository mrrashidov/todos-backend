import { ModelType } from "../../enum/ModelType";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notification {
     
     @PrimaryGeneratedColumn()
      id: number;

     @Column()
      modelId: number;

     @Column({ type: 'enum', enum: ModelType })
      modelType: ModelType;

     @Column()
      subject: string;

     @Column()
      body: string;

     @CreateDateColumn({
          type: 'timestamp',
          precision: 3
     })
     private createdAt: Date;

}
