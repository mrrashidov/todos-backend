import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { CreateColorDto } from './create-color.dto';

export class UpdateColorDto extends CreateColorDto {
    @ApiProperty()
    @IsInt()
    id: number;
}
