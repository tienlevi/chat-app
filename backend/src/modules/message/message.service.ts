import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Message } from '../../schemas/message.schema';
import SendMessageDto from './dto/send-message.dto';
import { User } from '../../schemas/user.schema';
import { Friend } from '../../schemas/friend.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Friend.name) private friendModel: Model<Friend>,
  ) {}

  async sendMessage(
    senderId: string,
    receiverId: string,
    data: SendMessageDto,
  ) {
    const friendByUser = await this.friendModel.findOne({ userId: senderId });
    const isBlockByMe = friendByUser?.blockFriends.some(
      (f) => f === receiverId,
    );
    const isBlockByThem = friendByUser?.blockedBy.some((f) => f === receiverId);

    if (isBlockByMe || isBlockByThem) {
      throw new HttpException(
        'You cant send message because you block them or them block you',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const receiver = await this.userModel.findById(receiverId);
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
      receiverId,
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

  async unsendMessage(userId: string, messageId: string) {
    if (!userId) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!messageId) {
      throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
    }

    const message = await this.messageModel.findById(messageId);

    if (message?.senderId.toString() === userId) {
      await this.messageModel.findByIdAndUpdate(
        messageId,
        { isUnsend: true },
        { new: true },
      );

      return { message: 'Unsend message successfully' };
    }

    throw new HttpException('Unsend failed', HttpStatus.BAD_REQUEST);
  }
}
