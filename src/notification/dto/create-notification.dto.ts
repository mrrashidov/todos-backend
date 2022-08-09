import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { ModelType } from "src/enum/ModelType";

export class CreateNotificationDto {
    
     @ApiProperty()
     @IsInt()
     @IsNotEmpty()
     modelId: number;

     @ApiProperty()
     @IsString()
     @IsNotEmpty()
      modelType: ModelType;

     @ApiProperty()
     @IsString()
     @IsNotEmpty()
      subject: string;

     @ApiProperty()
     @IsString()
     @IsNotEmpty()
      body: string;
}
