import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as argon from "argon2";
import { Model } from "mongoose";
import { User } from "src/schemas/user.schema";
import { TokenService } from "src/token/token.service";
import { v4 as uuid } from "uuid";
import { PayloadDto } from "./dto/payload.dto";
import { CreateUserDto } from "./dto/user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private tokenService: TokenService
  ) {}

  async registration(createUserDto: CreateUserDto) {
    const existsUser = await this.getUserByEmail(createUserDto.email);

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

    const payload: PayloadDto = {
      id: user._id.toString(),
      email: user.email,
      isActivated: user.isActivated,
    };

    const tokens = this.tokenService.generateTokens(payload);
    await this.tokenService.saveToken(payload.id, tokens.refreshToken);
    return { ...tokens, user: payload };
  }

  async login() {}

  async logout() {}

  async getUsers() {
    const users = await this.userModel.find().select("-password");
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel
      .findOne({
        email,
      })
      .select("-password");

    return user;
  }

  async getUserById(id: string) {
    const user = await this.userModel
      .findOne({
        _id: id,
      })
      .select("-password");

    return user;
  }
}
