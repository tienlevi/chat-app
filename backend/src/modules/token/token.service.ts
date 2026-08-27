import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from '../../schemas/token.schema';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
  ) {}

  async refreshToken(req: any) {
    const user = req.user;
    const payload = { userId: user.userId };

    const newAccessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '6h',
    });
    const newRefreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '3d',
    });

    await this.tokenModel.findOneAndUpdate(
      { userId: user.userId },
      { refreshToken: newRefreshToken, userId: user.userId },
      { new: true, upsert: true },
    );

    return {
      message: 'Refresh token successfully',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
