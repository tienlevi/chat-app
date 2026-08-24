import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Otp } from '../../schemas/otp.schema';
import { generateRandomOtpCode } from '../../utils/random';

@Injectable()
export class OtpService {
  constructor(@InjectModel(Otp.name) private otpModel: Model<Otp>) {}

  async generateOtp() {
    const code = generateRandomOtpCode(6);

    await this.otpModel.create({ code });
  }
}
