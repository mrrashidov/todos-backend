import { IsInt, IsNotEmpty } from "class-validator";
import { Timestamp } from "typeorm";

export class CreateProjectDto {

     @IsNotEmpty()
     name: string;
    
     @IsInt()
     userId: number;

     parentProjectId: number;

     colorId: number

}
