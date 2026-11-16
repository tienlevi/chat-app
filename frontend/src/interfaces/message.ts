export type MessageEmoji =
  | "like"
  | "dislike"
  | "heart"
  | "smile"
  | "sad"
  | "angry";

export type MessageFileType = "file" | "image" | "video";

export interface MessageFile {
  _id: string;
  type: MessageFileType;
  url: string;
}

export interface PendingFile {
  id: string;
  file: File;
  type: MessageFileType;
}

export interface IMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  files: MessageFile[];
  isDeleted: boolean;
  isRead: boolean;
  emoji?: MessageEmoji;
  createdAt: string;
  updatedAt: string;
}
