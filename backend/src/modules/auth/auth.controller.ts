import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async handleLogin(@Body() data: LoginDto) {
    return await this.authService.login(data);
  }

  @Post('register')
  async handleRegister(@Req() req: any) {
    return await this.authService.register(req);
  }

  @Get('verify-email')
  async getVerifyEmail(
    @Query('email') email: string,
    @Query('code') otpCode: string,
    @Query('otpId') otpId: string,
  ) {
    return await this.authService.verifyEmail(email, otpCode, otpId);
  }
}
