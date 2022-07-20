import { Color } from "src/color/entities/color.entity";
import { Label } from "src/label/entities/label.entity";
import { Project } from "src/project/entities/project.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class Issue {
     @PrimaryGeneratedColumn()
     private id: number;

     @JoinColumn()
     @ManyToOne(()=>Issue)
     private parentIssue: Issue;

     @Column()
     private title: string

     @Column()
     private description: string
    

     @Column('text')
     private status:  IssueStatus;

     
     @Column('text')
     private priority: Priority;

     @Column({type: "timestamp"})
     private dueDate: Timestamp

     @JoinColumn()
     @ManyToOne(() => Project)
     private project: Project


     @ManyToMany(() => Color)
     @JoinTable()
     private color: Color
   
     
     @JoinColumn()
     @ManyToOne(() => User)
     private user: User;


     @Column({type: "timestamp"})
     private createdAt: Timestamp

     
     @ManyToMany(() => Label)
     @JoinTable()
     private labels: Label

}
