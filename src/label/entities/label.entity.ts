import { Color } from "src/color/entities/color.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Label {
     @PrimaryGeneratedColumn()
     private id: number;
 
     @Column()
     private name: string;

     @JoinColumn()
     @ManyToOne(()=>Color)
     private color: Color
}
