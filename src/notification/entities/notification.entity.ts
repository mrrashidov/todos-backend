import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notification {
     @PrimaryGeneratedColumn()
     private id: number;

     @Column()
     private modelId: number;

     @Column()
     private modelType: string;

     @Column()
     private action: string;

     @Column()
     private subject: string;

     @Column()
     private body: string;

     @CreateDateColumn({
          type: 'timestamp',
          precision: 3
     })
     private createdAt: Date;

}
