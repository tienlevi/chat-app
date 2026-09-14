import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  dayKey,
  daysAgo,
  formatDayDivider,
  minutesBetween,
} from "@/utils/datetime";
import type { IMessage } from "@/interfaces/message";
import type IUser from "@/interfaces/user";
import MessageBubble from "./MessageBubble";

/** Messages closer together than this by the same author render as one run. */
const GROUP_WINDOW_MINUTES = 5;

interface DayBucket {
  key: string;
  iso: string;
  messages: IMessage[];
}

const bucketByDay = (messages: IMessage[]): DayBucket[] =>
  messages.reduce<DayBucket[]>((buckets, message) => {
    const key = dayKey(message.createdAt);
    const current = buckets[buckets.length - 1];

    if (current?.key === key) {
      current.messages.push(message);
      return buckets;
    }

    buckets.push({ key, iso: message.createdAt, messages: [message] });
    return buckets;
  }, []);

interface MessageThreadProps {
  /** Messages between the current user and `participant`, oldest first. */
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
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";
  const bottomRef = useRef<HTMLDivElement>(null);

  const days = useMemo(() => bucketByDay(messages), [messages]);

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
        {days.map((day) => {
          const distance = daysAgo(day.iso);
          const label =
            formatDayDivider(day.iso, locale) ??
            (distance === 0
              ? t("chat.thread.today")
              : t("chat.thread.yesterday"));

          return (
            <div key={day.key}>
              <div className="sticky top-0 z-10 flex justify-center py-3">
                <span className="rounded-full border border-border bg-card/85 px-3 py-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase backdrop-blur">
                  {label}
                </span>
              </div>

              {day.messages.map((message, index) => {
                const previous = day.messages[index - 1];
                const next = day.messages[index + 1];
                const isOwn = message.senderId === currentUserId;

                const isFirstOfGroup =
                  !previous ||
                  previous.senderId !== message.senderId ||
                  minutesBetween(previous.createdAt, message.createdAt) >
                    GROUP_WINDOW_MINUTES;

                const isLastOfGroup =
                  !next ||
                  next.senderId !== message.senderId ||
                  minutesBetween(message.createdAt, next.createdAt) >
                    GROUP_WINDOW_MINUTES;

                return (
                  <MessageBubble
                    key={message._id}
                    message={message}
                    author={isOwn ? undefined : participant}
                    isOwn={isOwn}
                    isFirstOfGroup={isFirstOfGroup}
                    isLastOfGroup={isLastOfGroup}
                  />
                );
              })}
            </div>
          );
        })}

        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
}

export default MessageThread;
