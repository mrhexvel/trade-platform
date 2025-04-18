import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/schemas/user.schema";
import { TokenService } from "src/token/token.service";
import { PayloadDto } from "./dto/payload.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private tokenService: TokenService
  ) {}

  async getUsers() {
    const users = await this.userModel.find().select("-password");
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({
      email,
    });

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

  async generateResponseWithToken(user: UserDocument) {
    const payload: PayloadDto = {
      id: user._id.toString(),
      email: user.email,
      isActivated: user.isActivated,
    };

    const tokens = this.tokenService.generateTokens(payload);
    await this.tokenService.saveToken(payload.id, tokens.refreshToken);
    return { ...tokens, user: payload };
  }
}
