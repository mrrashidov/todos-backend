import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateUserNotificationDto {

     @ApiProperty()
     @IsInt()
     @IsNotEmpty()
     notification: number

     @ApiProperty()
     @IsInt()
     @IsNotEmpty()
     userId: number;

}
