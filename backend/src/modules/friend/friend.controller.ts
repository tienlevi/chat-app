import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
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
  async getFriendsByUserId(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return await this.friendService.getFriends(userId);
  }

  @Get('search')
  @UseGuards(AuthGuard)
  async searchFriends(
    @Req() req: AuthenticatedRequest,
    @Query('name') name?: string,
  ) {
    const userId = req.user.userId;
    return await this.friendService.searchFriends(name || '', userId);
  }

  @Post('add')
  @UseGuards(AuthGuard)
  async handleAddFriend(
    @Req() req: AuthenticatedRequest,
    @Body() data: { friendId: string },
  ) {
    const userId = req.user.userId;
    return await this.friendService.addFriend(userId, data.friendId);
  }

  @Post('accept/:friendId')
  @UseGuards(AuthGuard)
  async handleAcceptFriend(
    @Req() req: AuthenticatedRequest,
    @Param('friendId') friendId: string,
  ) {
    const userId = req.user.userId;
    return await this.friendService.acceptDelineFriend(userId, friendId, true);
  }

  @Post('deline/:friendId')
  @UseGuards(AuthGuard)
  async handleDelineFriend(
    @Req() req: AuthenticatedRequest,
    @Param('friendId') friendId: string,
  ) {
    const userId = req.user.userId;
    return await this.friendService.acceptDelineFriend(userId, friendId, false);
  }

  @Post('block/:friendId')
  @UseGuards(AuthGuard)
  async handleBlockFriend(
    @Req() req: AuthenticatedRequest,
    @Param('friendId') friendId: string,
  ) {
    const userId = req.user.userId;
    return await this.friendService.blockFriend(userId, friendId);
  }

  @Post('unblock/:friendId')
  @UseGuards(AuthGuard)
  async handleUnblockFriend(
    @Req() req: AuthenticatedRequest,
    @Param('friendId') friendId: string,
  ) {
    const userId = req.user.userId;
    return await this.friendService.unblockFriend(userId, friendId);
  }
}
