import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { FriendTab } from "@/interfaces/friend";

const TABS: FriendTab[] = ["all", "requests", "blocked"];

interface Props {
  counts: Record<FriendTab, number>;
  query: string;
  setQuery: (query: string) => void;
  tab: FriendTab;
  setTab: (tab: FriendTab) => void;
}

function FriendHeader({ counts, query, setQuery, tab, setTab }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <header className="px-5 pt-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl leading-none font-semibold tracking-tight">
              {t("friends.title")}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {t("friends.summary", { count: counts.all })}
            </p>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" className="rounded-2xl">
                <UserPlus />
                <span className="sr-only">{t("friends.add")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("friends.add")}</TooltipContent>
          </Tooltip>
        </div>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("friends.searchPlaceholder")}
            aria-label={t("friends.searchPlaceholder")}
            className="h-10 rounded-2xl border-transparent bg-secondary pl-9"
          />
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          {TABS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTab(option)}
              aria-pressed={tab === option}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                tab === option
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              {t(`friends.tabs.${option}`)}
              {counts[option] > 0 ? (
                <span className="tabular-nums opacity-70">
                  {counts[option]}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </header>
    </>
  );
}

export default FriendHeader;
