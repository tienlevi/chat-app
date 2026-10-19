import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PenSquare, Search } from "lucide-react";
import { ConversationFilter } from "@/interfaces/chat";
import { cn } from "@/lib/utils";
import { IMessage } from "@/interfaces/message";
import { useState } from "react";

interface Props {
  rows: IMessage[];
  filter: ConversationFilter;
  setFilter: (filter: ConversationFilter) => void;
}

function ConversationHeader({ rows, filter, setFilter }: Props) {
  const [query, setQuery] = useState("");
  const { t } = useTranslation();
  const FILTERS: ConversationFilter[] = ["all", "unread"];

  const unreadTotal = rows.filter((row) => !row.isRead);

  return (
    <header className="px-5 pt-5 pb-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl leading-none font-semibold tracking-tight">
            {t("chat.list.title")}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {unreadTotal.length > 0
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
  );
}

export default ConversationHeader;
