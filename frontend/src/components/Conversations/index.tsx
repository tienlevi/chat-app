import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ConversationFilter } from "@/interfaces/chat";
import type { IMessage } from "@/interfaces/message";
import type IUser from "@/interfaces/user";
import ConversationHeader from "./ConversationHeader";
import UserMessage from "./UserMessage";

interface ConversationListProps {
  users: IUser[];
  latestMessages: IMessage[];
  senderMessages: IMessage[];
  currentUserId: string;
  activeId?: string;
  className?: string;
}

function Conversations({
  users,
  latestMessages,
  senderMessages,
  currentUserId,
  activeId,
  className,
}: ConversationListProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<ConversationFilter>("all");
  const filterUsers = users.filter((user) =>
    senderMessages.some(
      (message) =>
        message.receiverId === user._id || message.senderId === user._id,
    ),
  );
  const latestMessagesByPartner = filterUsers.map((user) => {
    const latestMessage = latestMessages.find(
      (m) => m.receiverId === user._id || m.senderId === user._id,
    );
    const unreadMessage = senderMessages.filter(
      (m) => m.senderId === user._id && m.isRead === false,
    );

    return { ...user, unreadMessage: unreadMessage.length, latestMessage };
  });

  return (
    <section
      className={cn(
        "flex h-screen w-full flex-col rounded-3xl border border-border bg-card md:w-[336px] md:shrink-0 overflow-auto",
        className,
      )}
    >
      <ConversationHeader filter={filter} setFilter={setFilter} />

      <ScrollArea className="min-h-0 flex-1">
        <ul className="flex flex-col gap-0.5 px-2 pb-3">
          {latestMessagesByPartner.map((user) => (
            <UserMessage
              key={user._id ?? user.email}
              user={user}
              unreadMessages={user.unreadMessage}
              latestMessage={user.latestMessage!}
              isActive={user._id === activeId}
              currentUserId={currentUserId}
            />
          ))}

          {latestMessagesByPartner.length === 0 ? (
            <li className="px-4 py-12 text-center text-sm text-muted-foreground">
              {t("chat.list.empty")}
            </li>
          ) : null}
        </ul>
      </ScrollArea>
    </section>
  );
}

export default Conversations;
