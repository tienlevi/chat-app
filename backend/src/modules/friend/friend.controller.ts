import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthenticatedRequest } from '../../interfaces/request';

@Controller('friends')
export class FriendController {
  constructor(private friendService: FriendService) {}

  @Get('')
  @UseGuards(AuthGuard)
  async getFriends(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return await this.friendService.getFriends(userId);
  }

  @Post('add/:friendId')
  @UseGuards(AuthGuard)
  async handleAddFriend(
    @Req() req: AuthenticatedRequest,
    @Param('friendId') friendId: string,
  ) {
    const userId = req.user.userId;
    return await this.friendService.addFriend(userId, friendId);
  }
}
