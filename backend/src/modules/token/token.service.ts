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

  async refreshToken(token: string) {
    const user = await this.jwtService.verifyAsync(token);
    console.log('🚀 ~ TokenService ~ refreshToken ~ user:', user);
    const payload = { userId: user.userId };

    const newAccessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '20m',
    });
    const newRefreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30m',
    });

    await this.tokenModel.findOneAndUpdate(
      { userId: payload.userId },
      { refreshToken: newRefreshToken, userId: payload.userId },
      { new: true, upsert: true },
    );

    return {
      message: 'Refresh token successfully',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
