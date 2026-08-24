import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { Otp } from '../../schemas/otp.schema';
import { MailService } from '../../mail/mail.service';
import { baseApi } from '../../constants';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../../schemas/token.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });

    if (!user) {
      throw new HttpException("Account doesn't exist", HttpStatus.FORBIDDEN);
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);

    if (!isMatch) {
      throw new HttpException(
        'Email or password incorrect',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return { message: 'Login successfully', data: loginDto };
  }

  async register(req: any) {
    const { _id: optId } = req.otp;
    const { name, email, password, confirmPassword, avatar } = req.registerDto;
    if (password !== confirmPassword) {
      throw new HttpException(
        'Password and confirm password do not match',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await this.userModel.findOneAndUpdate(
      { email },
      { name, email, avatar, password: hashedPassword },
      { new: true, upsert: true },
    );
    const payload = { name, email, avatar, userId: user._id };
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '3d',
    });

    await this.tokenModel.create({ refreshToken, userId: user._id });

    const verifyUrl = `${baseApi}/auth/verify-email?email=${email}&code=${req.code}&otpId=${optId}`;
    await this.mailService.verifyEmail(email, name, req.code, verifyUrl);

    return {
      message: 'Register successfully please check email to verify user',
      data: { ...user.toObject() },
    };
  }

  async verifyEmail(email: string, otpCode: string, otpId: string) {
    if (!otpId || !otpCode || !email)
      throw new HttpException('OTP or email not found', HttpStatus.NOT_FOUND);
    const otp = await this.otpModel.findById(otpId);
    const isMatchOtp = await bcrypt.compare(otpCode, otp?.code || '');
    const now = new Date().getTime();
    const isExpiredVerify = now > (otp?.expiresAt || 0);

    if (!isMatchOtp) {
      throw new HttpException('Verify email failed', HttpStatus.UNAUTHORIZED);
    }

    if (isExpiredVerify) {
      throw new HttpException(
        'This OTP has expired to verify',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.otpModel.findByIdAndUpdate(
      otpId,
      { isUsed: true },
      { new: true },
    );
    await this.userModel.findOneAndUpdate(
      { email },
      { isAuthenticated: true },
      { new: true },
    );

    return {
      message: 'Verify email successfully',
    };
  }
}
