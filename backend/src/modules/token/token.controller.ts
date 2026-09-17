import { Body, Controller, Post } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Post('refresh-token')
  async handleRefreshToken(@Body() data: { token: string }) {
    return await this.tokenService.refreshToken(data.token || '');
  }
}
