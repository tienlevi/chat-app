import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import type SendMessageDto from './dto/send-message.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthenticatedRequest } from '../../interfaces/request';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post('send/receiver/:receiverId')
  @UseGuards(AuthGuard)
  async handleSendMessage(
    @Param('receiverId') receiverId: string,
    @Body() data: SendMessageDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const senderId = req.user.userId;
    if (receiverId === senderId) {
      throw new HttpException(
        "Don't send for yourself",
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return await this.messageService.sendMessage(senderId, receiverId, data);
  }

  @Get('receiver/:receiverId')
  @UseGuards(AuthGuard)
  async getMessagesByReceiverId(
    @Param('receiverId') receiverId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const senderId = req.user.userId;

    return await this.messageService.getMessagesByReceiverId(
      receiverId,
      senderId,
    );
  }

  @Get('sender')
  @UseGuards(AuthGuard)
  async getMessagesBySender(@Req() req: AuthenticatedRequest) {
    const senderId = req.user.userId;

    return await this.messageService.getMessagesBySenderId(senderId);
  }
}
