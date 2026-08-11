import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
    const { name, email, password, confirmPassword } = registerDto;

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
      password: hashedPassword,
    });

    return {
      message: 'Register successfully',
      data: user.toObject(),
    };
  }
}
