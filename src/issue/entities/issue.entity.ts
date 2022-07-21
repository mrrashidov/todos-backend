import { Color } from "src/color/entities/color.entity";
import { Label } from "src/label/entities/label.entity";
import { Project } from "src/project/entities/project.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

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

     @CreateDateColumn({ 
          type: 'timestamp', 
          precision: 3
        })
     dueDate: Date;

     @JoinColumn()
     @ManyToOne(() => Project)
     private project: Project


     @ManyToMany(() => Color)
     @JoinTable()
     private color: Color
   
     
     @JoinColumn()
     @ManyToOne(() => User)
     private user: User;


     @CreateDateColumn({ 
          type: 'timestamp', 
          precision: 3
        })
     private  createdAt: Date;

     
     @ManyToMany(() => Label)
     @JoinTable()
     private labels: Label

}
