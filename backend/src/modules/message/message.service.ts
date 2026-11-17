import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Message } from '../../schemas/message.schema';
import SendMessageDto from './dto/send-message.dto';
import { User } from '../../schemas/user.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async sendMessage(senderId: string, userId: string, data: SendMessageDto) {
    const receiver = await this.userModel.findById(userId);
    if (!receiver) {
      throw new HttpException('Receiver not found', HttpStatus.NOT_FOUND);
    }

    const text = data.text?.trim() || '';
    if (!text && !data.files?.length) {
      throw new HttpException(
        'Message must contain text or files',
        HttpStatus.BAD_REQUEST,
      );
    }

    const message = await this.messageModel.create({
      ...data,
      senderId,
      receiverId: userId,
    });

    return { message: 'Send message successfully', data: message.toObject() };
  }

  async getMessagesByReceiverId(receiverId: string, userId: string) {
    if (!receiverId || !userId) {
      throw new HttpException(
        'Sender or receiver not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const messages = await this.messageModel.find();

    return messages.filter(
      (m) =>
        (m.senderId.toString() === userId &&
          m.receiverId.toString() === receiverId) ||
        (m.senderId.toString() === receiverId &&
          m.receiverId.toString() === userId),
    );
  }

  async getMessagesByUserId(userId: string) {
    if (!userId || !isValidObjectId(userId)) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return await this.messageModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });
  }

  async getLatestMessage(userId: string) {
    const messages = await this.messageModel.find();
    const userMessages = messages.filter(
      (mess) =>
        mess.senderId.toString() === userId ||
        mess.receiverId.toString() === userId,
    );

    const latestByPartner = userMessages
      .sort(
        (a, b) =>
          new Date(b.get('createdAt')).getTime() -
          new Date(a.get('createdAt')).getTime(),
      )
      .reduce((acc, mess) => {
        const partnerId =
          mess.senderId.toString() === userId
            ? mess.receiverId.toString()
            : mess.senderId.toString();

        if (!acc[partnerId]) {
          acc[partnerId] = mess;
        }
        return acc;
      }, {});

    return Object.values(latestByPartner);
  }

  async readMessages(receiverId: string, userId: string) {
    const messages = await this.messageModel.find({
      isRead: false,
    });
    const unreadMessages = messages.filter(
      (m) =>
        m.senderId.toString() === receiverId &&
        m.receiverId.toString() === userId,
    );

    if (unreadMessages.length > 0) {
      await this.messageModel.updateMany(
        {
          senderId: receiverId,
          receiverId: userId,
          isRead: false,
        },
        {
          isRead: true,
        },
      );
    }

    return unreadMessages;
  }
}
