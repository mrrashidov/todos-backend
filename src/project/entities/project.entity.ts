import { Color } from "src/color/entities/color.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    private id: number;

    @Column()
    private name: string;

    @JoinColumn()
    @ManyToOne(() => User)
    private user: User;


    @JoinColumn()
    @ManyToOne(() => Project)
    private parent: Project;


    @CreateDateColumn({
        type: 'timestamp',
        precision: 3
    })
    private createdAt: Date;


    @ManyToMany(() => Color)
    @JoinTable()
    private color: Color
    children: any;



}
