import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from '../../schemas/token.schema';
import { AuthenticatedRequest } from '../../interfaces/request';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
  ) {}

  async refreshToken(req: AuthenticatedRequest) {
    const { userId } = req.user;
    const payload = { userId };

    const newAccessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '6h',
    });
    const newRefreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '3d',
    });

    await this.tokenModel.findOneAndUpdate(
      { userId },
      { refreshToken: newRefreshToken, userId },
      { new: true, upsert: true },
    );

    return {
      message: 'Refresh token successfully',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
