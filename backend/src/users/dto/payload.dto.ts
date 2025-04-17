import { IsBoolean, IsEmail, IsString } from "class-validator";

export class PayloadDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  isActivated: boolean;
}
