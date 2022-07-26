import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { Timestamp } from "typeorm";

export class CreateProjectDto {

     @IsString()
     name: string;
    
     @IsInt()
     userId: number;
 
     parentProjectId: number;
     
     colorId: number

}
