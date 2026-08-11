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

  async login(loginDto: LoginDto) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

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
