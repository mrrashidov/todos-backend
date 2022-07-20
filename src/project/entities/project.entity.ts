import { Color } from "src/color/entities/color.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Timestamp, Tree, TreeParent } from "typeorm";



@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    private id: number;

    @Column()
    private name: string;

    @JoinColumn()
    @ManyToOne(()=> User)
    private user: User;

    
    @JoinColumn()
    @ManyToOne(()=>Project)
    private parent: Project;
    

    @Column({type: "timestamp"})
    private createdAt: Timestamp

  
    @ManyToMany(() => Color)
    @JoinTable()
    private color: Color
    children: any;



}
