import { IsString, IsInt, Min, MinLength, IsEnum, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(4, { message: 'Username must be at least 4 characters long' })
    username: string;

    @IsEmail({}, { message: 'Please provide a valid email' })
    email: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    age?: number;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsEnum(['USER', 'ADMIN'], { message: 'Role must be either USER or ADMIN' })
    @IsOptional()
    role?: string;
}
