export type FriendTab = "all" | "common-friends" | "requests" | "blocked";

export interface FriendListItem {
  _id: string;
  userId: string;
  nickname: string | null;
  mutedNotification: boolean;
  isBlocked: boolean;
  pinMessage: string[];
}

export interface IFriend {
  _id: string;
  userId: string;
  friends: FriendListItem[];
  friendRequests: string[];
  friendRequestsSend: string[];
  createdAt: string;
  updatedAt: string;
}
