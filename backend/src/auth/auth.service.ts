import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as argon from "argon2";
import { Model } from "mongoose";
import { User } from "src/schemas/user.schema";
import { TokenService } from "src/token/token.service";
import { AuthUserDto } from "src/users/dto/user.dto";
import { UsersService } from "src/users/users.service";
import { v4 as uuid } from "uuid";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private userService: UsersService,
    private tokenService: TokenService
  ) {}

  async registration(createUserDto: AuthUserDto) {
    const existsUser = await this.userService.getUserByEmail(
      createUserDto.email
    );

    if (existsUser) {
      throw new ConflictException("User already exists.");
    }

    const hashedPassword = await argon.hash(createUserDto.password);
    const activationLink = uuid();

    const user = await this.userModel.create({
      email: createUserDto.email,
      password: hashedPassword,
      activationLink,
    });

    const data = await this.userService.generateResponseWithToken(user);
    return data;
  }

  async login(loginUserDto: AuthUserDto) {
    const user = await this.userService.getUserByEmail(loginUserDto.email);

    if (!user) {
      throw new BadRequestException("User not found.");
    }

    const isValidatePassword = await argon.verify(
      user.password,
      loginUserDto.password
    );

    if (!isValidatePassword) {
      throw new BadRequestException("Passsword is invalid.");
    }

    const data = await this.userService.generateResponseWithToken(user);
    return data;
  }

  async logout(refreshToken: string) {
    const token = await this.tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const userData = this.tokenService.validateAuthToken(refreshToken);
    const existsToken = await this.tokenService.checkToken(refreshToken);

    if (!userData || !existsToken) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.getUserById(userData.id);
    const data = await this.userService.generateResponseWithToken(user);
    return data;
  }
}
