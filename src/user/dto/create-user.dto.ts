import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { LoginDto } from "./update-user.dto";

export  class CreatedUserDto extends LoginDto {
  @ApiProperty()
  @IsString()
  username: string;
}




