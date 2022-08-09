import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";
import { LoginDto } from "./login-user.dto";

export  class CreatedUserDto extends LoginDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsInt()
  roleId: number;
}




