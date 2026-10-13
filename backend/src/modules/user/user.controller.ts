import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest } from '../../interfaces/request';
import { UserService } from './user.service';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('user')
  @UseGuards(AuthGuard)
  async getUser(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;

    return await this.userService.getUser(userId);
  }

  @Get('users')
  async getUsers() {
    return await this.userService.getUsers();
  }
}
