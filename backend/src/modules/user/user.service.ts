import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUser(userId: string) {
    const user = await this.userModel.findById(userId).select({ password: 0 });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getUsers(name?: string) {
    const users = await this.userModel
      .find()
      .select({ password: 0, createdAt: 0, updatedAt: 0, isAuthenticated: 0 });

    if (!name) {
      return users;
    }

    const keyword = name.toLowerCase();
    return users.filter((user) => user.name.toLowerCase().includes(keyword));
  }
}
