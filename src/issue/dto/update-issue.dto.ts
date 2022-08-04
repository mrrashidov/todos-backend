import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate,IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { number } from 'joi';
import { Priority } from 'src/enum/IssuePriority.enum';

export class UpdateIssueDto {

     @ApiProperty()
     @IsString()
     title: string;

     @ApiProperty()
     @IsString()
     description: string;

     @ApiProperty()
     priority: Priority;

     @ApiProperty()
     @IsDate()
     dueDate: Date;

     @ApiProperty()
     @IsInt()
     projectId: number;

     @ApiProperty()
     @IsInt()
     colorId: number;

     @ApiProperty()
     @IsArray()
     @Type(() => number)
     labels: number[];

}
