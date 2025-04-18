import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
