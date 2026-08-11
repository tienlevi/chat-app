import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Message {
  _id: Types.ObjectId;

  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  receiverId: string;

  @Prop({ required: true })
  text: string;

  @Prop({ _id: Types.ObjectId, default: [] })
  files: { type: 'file' | 'image' | 'video'; url: string }[];
}

export type MessageDocument = HydratedDocument<Message>;

export const MessageSchema = SchemaFactory.createForClass(Message);
