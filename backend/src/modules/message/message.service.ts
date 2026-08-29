import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../../schemas/message.schema';
import SendMessageDto from './dto/send-message.dto';
import { User } from '../../schemas/user.schema';
import { AuthenticatedRequest } from '../../interfaces/request';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async sendMessage(
    senderId: string,
    receiverId: string,
    data: SendMessageDto,
  ) {
    const receiver = await this.userModel.findById(receiverId);
    if (!receiver) {
      throw new HttpException('Receiver not found', HttpStatus.NOT_FOUND);
    }

    const message = await this.messageModel.create({
      ...data,
      senderId,
      receiverId,
    });

    return { message: 'Send message successfully', data: message.toObject() };
  }
}
