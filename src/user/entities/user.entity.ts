import { type } from "os";
import { json } from "stream/consumers";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("users")
export class User {
    
    @PrimaryGeneratedColumn()
     id: number;

    @Column()
    username: string;

    @Column()
    private email: string;
  
    @Column({ default: true })
    private avatar: string;

    @Column()
     private password: string

     @Column({
        type : "jsonb"
     })
    private settings:  JSON;


}

