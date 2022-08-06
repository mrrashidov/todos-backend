import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsInt, IsNotEmpty, IsNumberString, IsString, Max, Min } from "class-validator"
import { ModelType } from "../entities/model-type"

export class CreateFavouriteDto {
    @IsInt()
    @ApiProperty()
    @Min(1)
    @Max(12)
    @Type(() => Number)
    @IsNotEmpty()
    userId: number

    @IsInt()
    @ApiProperty()
    @Min(1)
    @Max(12)
    @Type(() => Number)
    modelId: number

    @IsNotEmpty()
    @ApiProperty()
    modelType: ModelType
}
