import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

@Schema({ versionKey: false, _id: true })
class MessageFile {
  _id: Types.ObjectId;

  @Prop({ required: true, enum: ['file', 'image', 'video'] })
  type: 'file' | 'image' | 'video';

  @Prop({ required: true })
  url: string;
}

const MessageFileSchema = SchemaFactory.createForClass(MessageFile);

@Schema({ versionKey: false, timestamps: true })
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  senderId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  receiverId: string;

  @Prop({ default: '' })
  text: string;

  @Prop({ type: [MessageFileSchema], default: [] })
  files: MessageFile[];

  @Prop({ default: false })
  isUnsend: boolean;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: '' })
  emoji: string;
}

export type MessageDocument = HydratedDocument<Message>;

export const MessageSchema = SchemaFactory.createForClass(Message);
