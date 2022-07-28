import { Color } from "src/color/entities/color.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Label {
     @PrimaryGeneratedColumn()
     id: number;

     @Column()
     name: string;

     @JoinColumn()
     @ManyToOne(() => Color)
     color: Color
}
