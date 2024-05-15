import { IsDateString, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthPayloadDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

export class UpdateProfileDto {
    @IsNotEmpty()
    @IsString()
    nickname: string;

    @IsNotEmpty()
    @IsString()
    fullname: string;

    @IsNotEmpty()
    @IsDateString()
    dateOfBirth: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    about: string;
}

export type IUser = {
    _id: string;
    username: string;
    nickname: string;
    fullname: string;
    dateOfBirth: string;
    email: string;
    about: string;
    password?: string;
    isVerify: boolean;
}

export type IOTP = {
    _id: string;
    otp: number;
    isExpired: boolean;
    idUser: string;
    createdAt: Date;
    updatedAt: Date;
}
