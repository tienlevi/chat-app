import type { IMessage } from "@/interfaces/message";

export const getThread = (
  messages: IMessage[],
  userId: string,
  otherId?: string,
): IMessage[] =>
  messages
    .filter(
      ({ senderId, receiverId }) =>
        (senderId === userId && receiverId === otherId) ||
        (senderId === otherId && receiverId === userId),
    )
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

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
