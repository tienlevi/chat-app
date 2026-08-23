import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from '../modules/auth/dto/register.dto';
import { Otp } from '../schemas/otp.schema';
import { generateRandomOtpCode } from '../utils/random';
import { User } from '../schemas/user.schema';

@Injectable()
export class RegisterMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(Otp.name) private readonly otpModel: Model<Otp>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async use(req: any, res: Response, next: NextFunction) {
    const data = req.body as RegisterDto;

    const code = generateRandomOtpCode();
    const now = new Date().getTime();
    const timeLeftRegister = 1000 * 60 * 5; // 5 minutes

    const otpList = await this.otpModel.find({ email: data.email });

    const isRateLimit = otpList.some((o) => o.expiresAt > now);
    if (isRateLimit) {
      throw new HttpException(
        'You has already registered user, please try again after 5 minutes',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const existUser = await this.userModel.findOne({ email: data.email });
    if (existUser?.isAuthenticated) {
      throw new HttpException(
        'This email is authenticated',
        HttpStatus.FORBIDDEN,
      );
    }

    const otp = await this.otpModel.create({
      code,
      email: data.email,
      expiresAt: now + timeLeftRegister,
      type: 'verify',
    });

    req['registerDto'] = data;
    req['otp'] = otp.toObject();
    next();
  }
}
