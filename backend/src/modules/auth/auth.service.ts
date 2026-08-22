import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../../schemas/token.schema';
import { MailService } from '../../mail/mail.service';
import { baseApi } from '../../constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private jwtService: JwtService,
    private mailService: MailService,
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

  async register(registerDto: RegisterDto) {
    const { name, email, password, confirmPassword, avatar } = registerDto;

    if (password !== confirmPassword) {
      throw new HttpException(
        'Password and confirm password do not match',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existUser = await this.userModel.findOne({ email });

    if (existUser) {
      throw new HttpException(
        'This email already registered',
        HttpStatus.FORBIDDEN,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await this.userModel.create({
      name,
      email,
      avatar,
      password: hashedPassword,
    });
    const payload = { name, email, avatar, userId: user._id };

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '3d',
    });
    const verifyUrl = `${baseApi}/auth/verify-email?refreshToken=${refreshToken}`;

    await this.mailService.verifyEmail(email, name, verifyUrl);

    return {
      message: 'Register successfully please check email to verify user',

      data: { ...user.toObject() },
    };
  }

  async verifyEmail(refreshToken: string) {
    if (!refreshToken)
      throw new HttpException('Token not found', HttpStatus.NOT_FOUND);

    const verifyUser = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_TOKEN,
    });

    if (!verifyUser) {
      throw new HttpException('Email not found', HttpStatus.UNAUTHORIZED);
    }

    const existToken = await this.tokenModel.findOne({
      userId: verifyUser.userId,
    });

    if (existToken) {
      throw new HttpException(
        'You have just verified your email.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    await this.tokenModel.create({ refreshToken, userId: verifyUser.userId });
    await this.userModel.findByIdAndUpdate(
      verifyUser.userId,
      { isAuthenticated: true },
      { new: true },
    );

    return {
      message: 'Verify email successfully',
    };
  }
}
