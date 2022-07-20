import { Label } from "src/label/entities/label.entity";
import { Project } from "src/project/entities/project.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Team {
     @PrimaryGeneratedColumn()
     private id: number;
 
     @JoinTable()
     @ManyToMany(()=>User)
     private user: User;
     
     
     
     @JoinTable()
     @ManyToMany(()=>Project)
     private project: Project;
     
     
     @JoinTable()
     @ManyToMany(()=>Label)
     private label: Label;




}
