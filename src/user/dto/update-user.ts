import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";
import { CreatedUserDto } from "./create-user.dto";

export  class UpdateUserDto extends CreatedUserDto {

    @ApiProperty()
    @IsInt()
    id: number;

}