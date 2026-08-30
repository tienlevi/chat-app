import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

@Schema({ versionKey: false, _id: true })
class FriendList {
  _id: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ default: null })
  nickname?: string;

  @Prop({ default: false })
  mutedNotification: boolean;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ default: [] })
  pinMessage: [];
}

@Schema({ versionKey: false, timestamps: true })
export class Friend {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: [FriendList], default: [] })
  friends: FriendList[];

  @Prop({ default: [] })
  friendsRequest: string[];
}

export type OtpDocument = HydratedDocument<Friend>;

export const OtpSchema = SchemaFactory.createForClass(Friend);
