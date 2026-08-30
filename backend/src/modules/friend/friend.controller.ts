import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthenticatedRequest } from '../../interfaces/request';

@Controller('')
export class FriendController {
  constructor(private friendService: FriendService) {}

  @Get('friends')
  @UseGuards(AuthGuard)
  async getFriends(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return await this.friendService.getFriends(userId);
  }
}
