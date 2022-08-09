import { Notification } from "@/notification/entities/notification.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserNotification {

     @PrimaryGeneratedColumn()
      id: number;

      @JoinColumn()
      @ManyToOne(()=>Notification)
      notification: Notification
 
      @JoinColumn()
      @ManyToOne(()=>User)
      user: User;

     @Column({default : false})
      read: boolean;

     @CreateDateColumn({default: null})
      readAt: Date;

}
