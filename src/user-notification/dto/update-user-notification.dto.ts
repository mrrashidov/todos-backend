import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty } from 'class-validator';

export class UpdateUserNotificationDto {

     @ApiProperty()
     @IsBoolean()
     @IsNotEmpty()
     isRead: boolean

     @ApiProperty()
     @IsDate()
     @IsNotEmpty()
     readDate: Date

}
