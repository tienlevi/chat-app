import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { OTPType } from '../interfaces/types';

@Schema({ versionKey: false, timestamps: true })
export class Otp {
  @Prop({ required: true })
  code: string;

  @Prop({ type: mongoose.Schema.Types.String, ref: 'User', required: true })
  email: string;

  @Prop({ required: true })
  type: OTPType;

  @Prop({ required: true })
  expiresAt: number;

  @Prop({ default: false })
  isUsed: boolean;
}

export type OtpDocument = HydratedDocument<Otp>;

export const OtpSchema = SchemaFactory.createForClass(Otp);
