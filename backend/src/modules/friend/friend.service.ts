import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Friend } from '../../schemas/friend.schema';

@Injectable()
export class FriendService {
  constructor(@InjectModel(Friend.name) private friendModel: Model<Friend>) {}

  async getFriends(userId: string) {
    return await this.friendModel.find({ userId });
  }
}
