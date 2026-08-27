import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TokenService } from './token.service';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Post('refresh-token')
  @UseGuards(AuthGuard)
  async handleRefreshToken(@Req() req: any) {
    return await this.tokenService.refreshToken(req);
  }
}
