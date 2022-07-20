import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Color {

    @PrimaryGeneratedColumn()
    private id: number;


    @Column()
    private name: string;



  
}
