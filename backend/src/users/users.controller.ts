import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/")
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @Get(":id")
  async getUser(id: string) {
    return await this.usersService.getUserById(id);
  }
}
