import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from '../../guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User } from '../../schemas/user.schema';

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
export class MessageGateway implements OnGatewayConnection {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token as string;
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload;
      await client.join(payload.userId);
    } catch {
      console.log('Socket unauthorized');
      client.disconnect();
    }
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

    this.server.to(receiverId).emit('receive-message', body);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('read-message')
  async readMessage(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    const readerId = client.data.user.userId;
    const { receiverId } = body;

    if (!receiverId || !isValidObjectId(receiverId)) {
      console.log('Invalid receiverId');
      throw new WsException('Invalid receiverId');
    }

    const receiver = await this.userModel.findById(receiverId);
    if (!receiver) {
      throw new WsException('Receiver not found');
    }

    this.server.to(receiverId).emit('read-message', { readerId });
  }
}
