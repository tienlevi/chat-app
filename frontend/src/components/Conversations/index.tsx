import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { countUnread, getThread } from "@/utils/message";
import type { ConversationFilter } from "@/interfaces/chat";
import type { IMessage } from "@/interfaces/message";
import type IUser from "@/interfaces/user";
import ConversationHeader from "./ConversationHeader";
import UserMessage from "./UserMessage";

interface ConversationListProps {
  users: IUser[];
  messages: IMessage[];
  currentUserId: string;
  activeId?: string;
  onSelect: (userId: string) => void;
  className?: string;
}

function Conversations({
  users,
  messages,
  currentUserId,
  activeId,
  onSelect,
  className,
}: ConversationListProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ConversationFilter>("all");

  const rows = useMemo(
    () =>
      users.map((user) => {
        const thread = getThread(messages, currentUserId, user._id);

        return {
          user,
          lastMessage: thread[thread.length - 1] as IMessage | undefined,
          unreadCount: countUnread(messages, currentUserId, user._id),
        };
      }),
    [users, messages, currentUserId],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return rows
      .filter(({ user, lastMessage, unreadCount }) => {
        if (filter === "unread" && unreadCount === 0) return false;
        if (!needle) return true;

        return (
          user.name.toLowerCase().includes(needle) ||
          Boolean(lastMessage?.text.toLowerCase().includes(needle))
        );
      })
      .sort((a, b) =>
        (b.lastMessage?.createdAt ?? "").localeCompare(
          a.lastMessage?.createdAt ?? "",
        ),
      );
  }, [rows, filter, query]);

  return (
    <section
      className={cn(
        "flex min-h-0 w-full flex-col rounded-3xl border border-border bg-card md:w-[336px] md:shrink-0",
        className,
      )}
    >
      <ConversationHeader
        rows={rows}
        query={query}
        setQuery={setQuery}
        filter={filter}
        setFilter={setFilter}
      />

      <ScrollArea className="min-h-0 flex-1">
        <ul className="flex flex-col gap-0.5 px-2 pb-3">
          {visible.map(({ user, lastMessage, unreadCount }) => {
            const isActive = user._id === activeId;
            const preview = lastMessage?.isDeleted
              ? t("chat.thread.deleted")
              : (lastMessage?.text ?? "");

            return (
              <UserMessage
                key={user._id ?? user.email}
                user={user}
                lastMessage={lastMessage}
                unreadCount={unreadCount}
                isActive={isActive}
                preview={preview}
                currentUserId={currentUserId}
                onSelect={onSelect}
              />
            );
          })}

          {visible.length === 0 ? (
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
