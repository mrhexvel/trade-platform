import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthUserDto } from "src/users/dto/user.dto";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authSevice: AuthService) {}

  @HttpCode(HttpStatus.OK)
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

  @HttpCode(HttpStatus.OK)
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

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
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

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post("/refresh")
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request
  ) {
    const { refreshToken } = request.cookies;
    const userData = await this.authSevice.refresh(refreshToken);
    response.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return userData;
  }
}
