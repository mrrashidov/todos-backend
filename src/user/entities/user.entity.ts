

import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity("users")
export class User {
 



  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({unique: true})
  email: string;

  @Column({ default: true })
  avatar: string;

  @Column({select: false})
  password: string

  @Column({nullable:true,
    type: "jsonb"
  })
  settings: JSON;

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }


}

