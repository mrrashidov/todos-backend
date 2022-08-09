import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class MailDto{

     @IsEmail()
     @IsNotEmpty()
     mail: string;

     @IsNotEmpty()
     @IsString()
     subject: string


     @IsNotEmpty()
     @IsString()
     text: string

}