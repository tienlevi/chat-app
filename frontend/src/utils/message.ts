import type { IMessage } from "@/interfaces/message";

export const countUnread = (
  messages: IMessage[],
  userId: string,
  otherId?: string,
): number =>
  messages.filter(
    (message) =>
      message.senderId === otherId &&
      message.receiverId === userId &&
      !message.isRead,
  ).length;
