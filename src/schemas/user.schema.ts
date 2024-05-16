import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  role: string;

  @Prop()
  about: string;

  @Prop()
  nickname: string;

  @Prop()
  fullname: string;

  @Prop()
  username: string;

  @Prop()
  dateOfBirth: string;

  @Prop({ default: false, required: true })
  isVerify: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);