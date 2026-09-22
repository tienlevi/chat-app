import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Friend } from '../../schemas/friend.schema';
import { User } from '../../schemas/user.schema';

@Injectable()
export class FriendService {
  constructor(
    @InjectModel(Friend.name) private friendModel: Model<Friend>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getFriends(userId: string | Types.ObjectId) {
    const friends = await this.friendModel.find({ userId });

    return friends.filter((friend) => friend.userId !== userId);
  }

  async addFriend(userId: string, friendId: string) {
    if (userId === friendId) {
      throw new BadRequestException('You cannot add yourself');
    }

    const user = await this.friendModel.findOne({ userId });
    const friend = await this.userModel.findById(friendId);
    if (!friend) {
      throw new NotFoundException('Friend not found');
    }

    let updateFriendRequest: string[] | undefined = user?.friendsRequest;
    updateFriendRequest?.push(friendId);

    await this.friendModel.findOneAndUpdate(
      { userId },
      { friendsRequest: updateFriendRequest },
    );

    return { message: 'Send request successfully' };
  }

  async acceptFriend(userId: string, friendId: string) {
    const friend = await this.userModel.findById(friendId);
    if (!friend) {
      throw new NotFoundException('Friend not found');
    }

    const alreadyFriends = await this.friendModel.findOne({
      userId,
      'friends.userId': friendId,
    });

    if (alreadyFriends) {
      throw new BadRequestException('You are already friends');
    }

    const newFriend = await this.friendModel.findOneAndUpdate(
      { userId },
      {
        $push: { friends: { userId: friendId } },
        $pull: { friendsRequest: friendId },
      },
      { returnDocument: 'after', upsert: true },
    );

    return { message: 'Accept friend successfully', data: newFriend };
  }
}
