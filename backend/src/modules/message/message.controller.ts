import { Body, Controller, Param, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import type SendMessageDto from './dto/send-message.dto';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post('sender/:senderId/receiver/:receiverId')
  async handleSendMessage(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
    @Body() data: SendMessageDto,
  ) {
    return await this.messageService.sendMessage(senderId, receiverId, data);
  }
}
