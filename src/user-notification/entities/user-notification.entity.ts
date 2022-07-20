import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class UserNotification {

     @PrimaryGeneratedColumn()
     private id: number;
 
     @JoinColumn()
     @ManyToOne(()=>User)
     private user: User;

     @Column()
     private read: boolean;

     @Column({type: "timestamp"})
     private readAt: Timestamp;

}
