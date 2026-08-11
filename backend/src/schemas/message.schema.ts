import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Message {
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  receiverId: string;

  @Prop({ required: true })
  text: string;

  @Prop({ _id: Types.ObjectId, default: [] })
  files: { type: 'file' | 'image' | 'video'; url: string }[];

  @Prop({ default: false })
  isDeleted: boolean;
}

export type MessageDocument = HydratedDocument<Message>;

export const MessageSchema = SchemaFactory.createForClass(Message);
