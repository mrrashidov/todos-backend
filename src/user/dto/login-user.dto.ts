
import { ApiProperty } from '@nestjs/swagger';
import {  IsEmail, IsNotEmpty, IsNumber, IsPassportNumber } from 'class-validator';

export class    LoginDto {

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsNumber()
    password: string;

}

