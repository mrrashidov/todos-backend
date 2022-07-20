import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from "typeorm";

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

     @Column({type: "timestamp"})
     private createdAt: Timestamp


}
