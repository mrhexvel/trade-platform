import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthUserDto } from "src/users/dto/user.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authSevice: AuthService) {}

  @Post("/create")
  async registrationUser(
    @Body() createUserDto: AuthUserDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const userData = await this.authSevice.registration(createUserDto);
    response.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return userData;
  }

  @Post("/login")
  async login(
    @Body() loginUserDto: AuthUserDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const userData = await this.authSevice.login(loginUserDto);
    response.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return userData;
  }

  @Post("/logout")
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const { refreshToken } = request.cookies;
    const token = await this.authSevice.logout(refreshToken);
    response.clearCookie("refreshToken");
    return { token };
  }
}
