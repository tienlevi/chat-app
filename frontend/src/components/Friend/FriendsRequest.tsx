import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Check, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserAvatar from "../UserAvatar";

interface FriendsRequestProps {
  requests: string[];
  query?: string;
  pendingId?: string;
  onAccept?: (userId: string) => void;
  onDecline?: (userId: string) => void;
}

function FriendsRequest({
  requests,
  query = "",
  pendingId,
  onAccept,
  onDecline,
}: FriendsRequestProps) {
  const { t } = useTranslation();

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return requests;

    return requests.filter((userId) => userId.toLowerCase().includes(needle));
  }, [requests, query]);

  if (visible.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
          <UserPlus className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold">
            {t("friends.requests.emptyTitle")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("friends.requests.emptySubtitle")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-0.5 px-2 pb-3">
      <li className="px-3 pt-1 pb-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {t("friends.requests.heading", { count: visible.length })}
      </li>

      {visible.map((userId) => {
        const isPending = pendingId === userId;

        return (
          <li
            key={userId}
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-secondary/60"
          >
            <UserAvatar name={userId} seed={userId} size="lg" />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{userId}</p>
              <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
                {t("friends.requests.incoming")}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="size-9 rounded-xl"
                    disabled={isPending}
                    onClick={() => onDecline?.(userId)}
                  >
                    <X />
                    <span className="sr-only">
                      {t("friends.requests.decline")}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("friends.requests.decline")}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="size-9 rounded-xl"
                    disabled={isPending}
                    onClick={() => onAccept?.(userId)}
                  >
                    <Check />
                    <span className="sr-only">
                      {t("friends.requests.accept")}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("friends.requests.accept")}</TooltipContent>
              </Tooltip>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default FriendsRequest;
