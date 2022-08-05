import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
 
  @ApiProperty()
  colorId: number;
}
