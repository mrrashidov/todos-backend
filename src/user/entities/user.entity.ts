
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("users")
export class User {
    
    @PrimaryGeneratedColumn()
    private id: number;

    @Column()
    private username: string;

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

