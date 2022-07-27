
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("users")
export class User {
    
    @PrimaryGeneratedColumn()
     id: number;

    @Column()
    username: string;

    @Column()
     email: string;
  
    @Column({ default: true })
     avatar: string;

    @Column()
      password: string

     @Column({
        type : "jsonb"
     })
     settings:  JSON;


}

