import { Color } from "src/color/entities/color.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Timestamp, Tree, TreeParent } from "typeorm";



@Entity()
export class Project {

    @PrimaryGeneratedColumn()
     id: number;

    @Column()
     name: string;

    @JoinColumn()
    @ManyToOne(()=> User)
     user: User;

    
    @JoinColumn()
    @ManyToOne(()=>Project)
     parentProject: Project;
    

     @CreateDateColumn({ 
        type: 'timestamp', 
        precision: 3
      })
      createdAt: Date;

  
    
      @JoinColumn()
      @ManyToOne(()=>Color)
      color: Color
   
   @Column({
    default:  false
   })
      isDelete: boolean
    

 

}
