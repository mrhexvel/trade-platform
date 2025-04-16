import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { HydratedDocument } from "mongoose";
import { User } from "./user.schema";

export type TokenDocument = HydratedDocument<Token>;

@Schema()
export class Token {
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
	user: User;

	@Prop({ type: String, required: true })
	refreshToken: String;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
