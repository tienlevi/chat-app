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

  async searchFriends(name: string, userId: string) {
    const users = await this.userModel.find().select({
      password: 0,
      createdAt: 0,
      updatedAt: 0,
      isAuthenticated: 0,
    });
    const list = users.filter((user) => user.id !== userId);

    if (!name) {
      return list;
    }

    const keyword = name.toLowerCase();
    const result = list.filter((user) =>
      user.name.toLowerCase().includes(keyword),
    );

    return result;
  }

  async addFriend(userId: string, friendId: string) {
    if (userId === friendId) {
      throw new BadRequestException('You cannot add yourself');
    }

    const user = await this.friendModel.findOne({ userId });
    const friend = await this.friendModel.findOne({ userId: friendId });
    if (!friend) {
      throw new NotFoundException('Friend not found');
    }

    let updateFriendRequestsSend: string[] | undefined =
      user?.friendRequestsSend;
    let updateFriendRequests: string[] | undefined = friend?.friendRequests;
    updateFriendRequestsSend?.push(friendId);
    updateFriendRequests?.push(userId);

    await this.friendModel.findOneAndUpdate(
      { userId: friendId },
      {
        friendRequests: updateFriendRequests,
      },
    );

    await this.friendModel.findOneAndUpdate(
      { userId },
      {
        friendRequestsSend: updateFriendRequestsSend,
      },
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
        $pull: { friendRequests: friendId },
      },
      { returnDocument: 'after', upsert: true },
    );

    return { message: 'Accept friend successfully', data: newFriend };
  }
}
