import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MinLength } from "class-validator";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsStrongPassword()
    @MinLength(8)
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsStrongPassword()
    @MinLength(8)
    @IsNotEmpty()
    confirmPassword : string;
}
