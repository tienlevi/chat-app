import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PenSquare, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserAvatar from "@/components/UserAvatar";
import { formatListStamp } from "@/utils/datetime";
import { countUnread, getThread } from "@/utils/message";
import type { ConversationFilter } from "@/interfaces/chat";
import type { IMessage } from "@/interfaces/message";
import type IUser from "@/interfaces/user";

const FILTERS: ConversationFilter[] = ["all", "unread"];

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
  const { t, i18n } = useTranslation();
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

  const unreadTotal = rows.reduce((total, row) => total + row.unreadCount, 0);

  return (
    <section
      aria-label={t("chat.list.label")}
      className={cn(
        "flex min-h-0 w-full flex-col rounded-3xl border border-border bg-card md:w-[336px] md:shrink-0",
        className,
      )}
    >
      <header className="px-5 pt-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl leading-none font-semibold tracking-tight">
              {t("chat.list.title")}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {unreadTotal > 0
                ? t("chat.list.unreadSummary", { count: unreadTotal })
                : t("chat.list.allCaughtUp")}
            </p>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" className="rounded-2xl">
                <PenSquare />
                <span className="sr-only">{t("chat.list.compose")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("chat.list.compose")}</TooltipContent>
          </Tooltip>
        </div>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("chat.list.searchPlaceholder")}
            aria-label={t("chat.list.searchPlaceholder")}
            className="h-10 rounded-2xl border-transparent bg-secondary pl-9"
          />
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          {FILTERS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={filter === option}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                filter === option
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              {t(`chat.list.filters.${option}`)}
            </button>
          ))}
        </div>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <ul className="flex flex-col gap-0.5 px-2 pb-3">
          {visible.map(({ user, lastMessage, unreadCount }) => {
            const isActive = user._id === activeId;
            const preview = lastMessage?.isDeleted
              ? t("chat.thread.deleted")
              : (lastMessage?.text ?? "");

            return (
              <li key={user._id ?? user.email}>
                <button
                  type="button"
                  onClick={() => {
                    if (user._id) onSelect(user._id);
                  }}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors",
                    "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                    isActive ? "bg-secondary" : "hover:bg-secondary/60",
                  )}
                >
                  <UserAvatar
                    name={user.name}
                    seed={user._id}
                    src={user.avatar}
                    size="lg"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-semibold">
                        {user.name}
                      </span>
                      {lastMessage ? (
                        <span className="ml-auto shrink-0 text-[11px] text-muted-foreground tabular-nums">
                          {formatListStamp(
                            lastMessage.createdAt,
                            i18n.resolvedLanguage ?? "en",
                          )}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      <p
                        className={cn(
                          "min-w-0 flex-1 truncate text-[13px]",
                          unreadCount > 0
                            ? "font-medium text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {lastMessage?.senderId === currentUserId
                          ? t("chat.list.youPrefix", { text: preview })
                          : preview}
                      </p>

                      {unreadCount > 0 ? (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground tabular-nums">
                          {unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              </li>
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
