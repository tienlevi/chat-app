import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import UpdateProfileDto from './dto/update-profile.dto';

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

  async updateProfile(userId: string, data: UpdateProfileDto) {
    const update: Partial<Pick<User, 'name' | 'avatar'>> = {};

    if (data?.name !== undefined) {
      if (typeof data.name !== 'string') {
        throw new BadRequestException('Name must be a string');
      }
      const name = data.name.trim();
      if (name.length < 2 || name.length > 50) {
        throw new BadRequestException(
          'Name must be between 2 and 50 characters',
        );
      }
      update.name = name;
    }

    if (data?.avatar !== undefined) {
      if (typeof data.avatar !== 'string') {
        throw new BadRequestException('Avatar must be a string');
      }
      let url: URL;
      try {
        url = new URL(data.avatar);
      } catch {
        throw new BadRequestException('Avatar must be a valid URL');
      }
      if (url.protocol !== 'https:') {
        throw new BadRequestException('Avatar must be an https URL');
      }
      update.avatar = url.toString();
    }

    if (Object.keys(update).length === 0) {
      throw new BadRequestException('Nothing to update');
    }

    const user = await this.userModel
      .findByIdAndUpdate(userId, { $set: update }, { new: true })
      .select({ password: 0 });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getUsers() {
    return await this.userModel.find();
  }
}
