import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BellOff, Pin, PenSquare, Search } from "lucide-react";
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
import type { Conversation, ConversationFilter } from "@/interfaces/chat";

const FILTERS: ConversationFilter[] = ["all", "unread", "groups"];

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}

function Conversations({
  conversations,
  activeId,
  onSelect,
  className,
}: ConversationListProps) {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ConversationFilter>("all");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return conversations
      .filter((conversation) => {
        if (filter === "unread" && conversation.unreadCount === 0) return false;
        if (filter === "groups" && conversation.kind !== "group") return false;
        if (!needle) return true;

        return (
          conversation.name.toLowerCase().includes(needle) ||
          conversation.preview.toLowerCase().includes(needle)
        );
      })
      .sort((a, b) => {
        if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
        return b.updatedAt.localeCompare(a.updatedAt);
      });
  }, [conversations, filter, query]);

  const unreadTotal = conversations.reduce(
    (total, conversation) => total + conversation.unreadCount,
    0,
  );

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
          {visible.map((conversation) => {
            const isActive = conversation.id === activeId;
            const primary = conversation.participants[0];

            return (
              <li key={conversation.id}>
                <button
                  type="button"
                  onClick={() => onSelect(conversation.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors",
                    "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                    isActive ? "bg-secondary" : "hover:bg-secondary/60",
                  )}
                >
                  <UserAvatar
                    name={conversation.name}
                    seed={conversation.id}
                    status={
                      conversation.kind === "direct"
                        ? primary?.status
                        : undefined
                    }
                    size="lg"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      {conversation.pinned ? (
                        <Pin className="size-3 shrink-0 rotate-45 text-muted-foreground" />
                      ) : null}
                      <span className="truncate text-sm font-semibold">
                        {conversation.name}
                      </span>
                      {conversation.muted ? (
                        <BellOff className="size-3 shrink-0 text-muted-foreground" />
                      ) : null}
                      <span className="ml-auto shrink-0 text-[11px] text-muted-foreground tabular-nums">
                        {formatListStamp(
                          conversation.updatedAt,
                          i18n.resolvedLanguage ?? "en",
                        )}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      <p
                        className={cn(
                          "min-w-0 flex-1 truncate text-[13px]",
                          conversation.unreadCount > 0
                            ? "font-medium text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {conversation.typing
                          ? t("chat.thread.typingShort")
                          : conversation.preview}
                      </p>

                      {conversation.unreadCount > 0 ? (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground tabular-nums">
                          {conversation.unreadCount}
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
