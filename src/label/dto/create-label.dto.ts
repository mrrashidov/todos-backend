import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateLabelDto {

    @IsString()
    @ApiProperty()
    name: string;

    @ApiProperty()
    colorId: number;
}
