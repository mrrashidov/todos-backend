import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateColorDto {
    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    name: string;
}
