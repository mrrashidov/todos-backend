import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { Priority } from "src/enum/IssuePriority.enum";

export class CreateIssueDto {

      @ApiProperty() 
     parentIssueId: number;

     @ApiProperty() 
     @IsString()
     @IsNotEmpty()
     title: string;

     @ApiProperty() 
     description: string;

     @ApiProperty() 
     @IsNotEmpty()
     priority: Priority;

     @ApiProperty() 
     @IsNotEmpty()
     dueDate: Date;

     @ApiProperty() 
     projectId: number;

     @ApiProperty() 
     @IsInt()
     @IsNotEmpty()
     colorId: number;

     @ApiProperty() 
     @IsNotEmpty()
     @IsInt()
     userId: number;

     @ApiProperty() 
     labels: number[]

}
