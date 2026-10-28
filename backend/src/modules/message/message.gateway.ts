import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from '../../guards/auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { MessageService } from './message.service';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:5173',
      'https://chat-app-blush-two-12.vercel.app',
      'https://chat-app-tienlevis-projects.vercel.app',
    ],
    credentials: true,
  },
})
export class MessageGateway implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private messageService: MessageService,
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
    });
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('send-message')
  async sendMessage(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = client.data.user.userId;
    const { receiverId } = body;

    if (!receiverId || !isValidObjectId(receiverId)) {
      console.log('Invalid receiverId');
      throw new WsException('Invalid receiverId');
    }
    if (receiverId === senderId) {
      console.log("Don't send for yourself");
      throw new WsException("Don't send for yourself");
    }

    const receiver = await this.userModel.findById(receiverId);
    if (!receiver) {
      console.log('Receiver not found');
      throw new WsException('Receiver not found');
    }

    this.server.emit('message', body);

    await this.messageService.sendMessage(senderId, receiverId, body);
  }
}
