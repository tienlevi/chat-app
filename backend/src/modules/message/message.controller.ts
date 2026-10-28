import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthenticatedRequest } from '../../interfaces/request';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

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

  @Get('user')
  @UseGuards(AuthGuard)
  async getMessagesByUser(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;

    return await this.messageService.getMessagesByUserId(userId);
  }
}
