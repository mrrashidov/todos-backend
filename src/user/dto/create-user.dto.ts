import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    firstName: string;
    lastName: string;
    isActive: boolean
}

export default CreateUserDto;