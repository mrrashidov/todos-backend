import { ApiProperty } from "@nestjs/swagger";
import { CreatedUserDto } from "./create-user.dto";

export  class UpdateUserDto extends CreatedUserDto {

    @ApiProperty()
    id: number;

}