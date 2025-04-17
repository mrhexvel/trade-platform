import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { CreateUserDto } from "./dto/user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/")
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @Post()
  async registrationUser(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const userData = await this.usersService.registration(createUserDto);
    response.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return userData;
  }

  @Get(":id")
  async getUser(id: string) {
    return await this.usersService.getUserById(id);
  }
}
