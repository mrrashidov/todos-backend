import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator"
import { number } from "joi"
import { ModelType } from "src/enum/model-type"

export class CreateCommentDto {
    @IsInt()
    @ApiProperty()
    @Min(1)
    @Max(12)
    @Type(() => number)
    @IsNotEmpty()
    userId: number

    @IsInt()
    @ApiProperty()
    @Min(1)
    @Max(12)
    @Type(() => number)
    modelId: number

    @IsNotEmpty()
    @ApiProperty()
    modelType: ModelType

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    text:string
}
  
