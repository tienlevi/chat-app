import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  formatTimestampToString,
  daysAgo,
  formatDayDivider,
} from "@/utils/datetime";
import type { IMessage } from "@/interfaces/message";
import type IUser from "@/interfaces/user";
import MessageBubble from "./MessageBubble";

const GROUP_MESSAGE_MS = 5 * 60 * 1000;

const isSameGroup = (a?: IMessage, b?: IMessage): boolean => {
  if (!a || !b) return false;
  if (a.senderId !== b.senderId) return false;
  if (
    formatTimestampToString(a.createdAt) !==
    formatTimestampToString(b.createdAt)
  )
    return false;
  const gap = Math.abs(
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return gap <= GROUP_MESSAGE_MS;
};

interface MessageThreadProps {
  messages: IMessage[];
  participant: IUser;
  currentUserId: string;
  className?: string;
}

function MessageThread({
  messages,
  participant,
  currentUserId,
  className,
}: MessageThreadProps) {
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);

  const dayLabel = (iso: string): string => {
    const days = daysAgo(iso);
    if (days <= 0) return t("chat.thread.today");
    if (days === 1) return t("chat.thread.yesterday");
    return formatDayDivider(iso) ?? "";
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [participant._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  return (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 sm:px-6",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col">
        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const next = messages[index + 1];
          const isOwn = message.senderId === currentUserId;

          const isNewDay =
            !previous ||
            formatTimestampToString(previous.createdAt) !==
              formatTimestampToString(message.createdAt);
          const isGroupStart = !isSameGroup(previous, message);
          const isGroupEnd = !isSameGroup(message, next);

          return (
            <div
              key={message._id}
              className={cn(isGroupStart ? "mt-3" : "mt-0.5")}
            >
              {isNewDay && (
                <div className="sticky top-0 z-10 flex justify-center py-3">
                  <span className="rounded-full border border-border bg-card/85 px-3 py-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase backdrop-blur">
                    {dayLabel(message.createdAt)}
                  </span>
                </div>
              )}

              <MessageBubble
                message={message}
                author={isOwn ? undefined : participant}
                isOwn={isOwn}
                showAvatar={isGroupEnd}
              />
            </div>
          );
        })}

        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
}

export default MessageThread;
