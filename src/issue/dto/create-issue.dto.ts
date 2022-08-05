import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { number } from 'joi';
import { Priority } from 'src/enum/IssuePriority.enum';

export class CreateIssueDto {
  @ApiProperty()
  @IsInt()
  parentIssueId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  priority: Priority;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  dueDate: Date;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
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
  @IsArray()
  @Type(() => number)
  labels: number[];
}
