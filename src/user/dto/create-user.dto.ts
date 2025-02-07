import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword, Max, Min, MinLength } from "class-validator";
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

    @IsNumber()
    @Min(0)
    @Max(5)
    @IsOptional()
    loginAttempts?: number = 0;
}
