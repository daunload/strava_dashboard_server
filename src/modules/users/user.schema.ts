import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
	@Prop({ required: true, unique: true })
	athleteId: number;

	@Prop({ required: true })
	accessToken: string;

	@Prop({ required: true })
	refreshToken: string;

	@Prop({ required: true })
	expiresAt: number; // UNIX timestamp
}

export const UserSchema = SchemaFactory.createForClass(User);
