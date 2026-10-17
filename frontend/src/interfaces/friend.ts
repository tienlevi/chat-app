export type FriendTab = "all" | "common-friends" | "requests" | "blocked";

export interface FriendListItem {
  _id: string;
  userId: string;
  nickname: string | null;
  mutedNotification: boolean;
  pinMessage: string[];
}

export interface IFriend {
  _id: string;
  userId: string;
  friends: FriendListItem[];
  friendRequests: string[];
  friendRequestsSend: string[];
  blockFriends: string[];
  blockedBy: string[];
  createdAt: string;
  updatedAt: string;
}
