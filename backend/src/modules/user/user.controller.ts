import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../../interfaces/request';
import { UserService } from './user.service';
import { AuthGuard } from '../../guards/auth.guard';
import UpdateProfileDto from './dto/update-profile.dto';

@Controller('')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('user')
  @UseGuards(AuthGuard)
  async getUser(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;

    return await this.userService.getUser(userId);
  }

  @Patch('user')
  @UseGuards(AuthGuard)
  async updateProfile(
    @Body() data: UpdateProfileDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.userService.updateProfile(req.user.userId, data);
  }

  @Get('users')
  async getUsers() {
    return await this.userService.getUsers();
  }
}
