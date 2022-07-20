import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserNotification {

     @PrimaryGeneratedColumn()
     private id: number;
 
     @JoinColumn()
     @ManyToOne(()=>User)
     private user: User;

     @Column()
     private read: boolean;

     @CreateDateColumn({ 
          type: 'timestamp', 
          precision: 3
        })
     private readAt: Date;

}
