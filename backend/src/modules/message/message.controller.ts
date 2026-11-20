import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Req,
  UseGuards,
  Post,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthenticatedRequest } from '../../interfaces/request';
import SendMessageDto from './dto/send-message.dto';
import UnsendMessageDto from './dto/unsend-message.dto';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post('send')
  @UseGuards(AuthGuard)
  async handleSendMessage(
    @Body() data: SendMessageDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    if (data.receiverId === userId) {
      throw new HttpException(
        "Don't send for yourself",
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return await this.messageService.sendMessage(userId, data.receiverId, data);
  }

  @Get('receiver/:receiverId')
  @UseGuards(AuthGuard)
  async getMessagesByReceiverId(
    @Param('receiverId') receiverId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;

    return await this.messageService.getMessagesByReceiverId(
      receiverId,
      userId,
    );
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async getMessagesByUser(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;

    return await this.messageService.getMessagesByUserId(userId);
  }

  @Get('latest')
  @UseGuards(AuthGuard)
  async getLatestMessages(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;

    return await this.messageService.getLatestMessage(userId);
  }

  @Get('read/:receiverId')
  @UseGuards(AuthGuard)
  async handleReadMessages(
    @Param('receiverId') receiverId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;

    return await this.messageService.readMessages(receiverId, userId);
  }

  @Post('unsend')
  @UseGuards(AuthGuard)
  async handleUnsendMessage(
    @Body() data: UnsendMessageDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;

    return await this.messageService.unsendMessage(userId, data.messageId);
  }
}
