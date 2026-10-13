import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

@Schema({ versionKey: false, _id: true })
class FriendList {
  _id: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

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
  userId: Types.ObjectId;

  @Prop({ type: [FriendList], default: [] })
  friends: FriendList[];

  @Prop({ default: [] })
  friendRequests: string[];

  @Prop({ default: [] })
  friendRequestsSend: string[];
}

export type FriendDocument = HydratedDocument<Friend>;

export const FriendSchema = SchemaFactory.createForClass(Friend);
