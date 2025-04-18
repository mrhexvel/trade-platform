import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Token } from "src/schemas/token.schema";
import { UserDocument } from "src/schemas/user.schema";
import { PayloadDto } from "src/users/dto/payload.dto";

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private jwtService: JwtService
  ) {}

  generateTokens(payload: PayloadDto) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: "30m",
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: "30d",
    });

    return { accessToken, refreshToken };
  }

  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await this.tokenModel.findOne({
      user: userId,
    });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const token = await this.tokenModel.create({
      user: userId,
      refreshToken,
    });
    return token;
  }

  async removeToken(refreshToken: string) {
    const token = await this.tokenModel.deleteOne({ refreshToken });
    return token;
  }

  async checkToken(refreshToken: string) {
    const token = await this.tokenModel.findOne({ refreshToken });
    return token;
  }

  validateAuthToken(token: string): UserDocument | null {
    try {
      const userData = this.jwtService.verify(token);
      return userData;
    } catch (error) {
      return null;
    }
  }
}
