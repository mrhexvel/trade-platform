import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
	@Prop({ type: String, unique: true, required: true })
	email: String;

	@Prop({ type: String, required: true })
	password: String;

	@Prop({ type: Boolean, default: false })
	isActivated: Boolean;

	@Prop({ type: String })
	activationLink: String;
}

export const UserSchema = SchemaFactory.createForClass(User);
