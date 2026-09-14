import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FriendListItem } from "@/interfaces/friend";
import UserAvatar from "../UserAvatar";

interface FriendsBlockedProps {
  blocked: FriendListItem[];
  query?: string;
  pendingId?: string;
  onUnblock?: (userId: string) => void;
}

function FriendsBlocked({
  blocked,
  query = "",
  pendingId,
  onUnblock,
}: FriendsBlockedProps) {
  const { t } = useTranslation();

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return blocked;

    return blocked.filter((item) =>
      (item.nickname ?? item.userId).toLowerCase().includes(needle),
    );
  }, [blocked, query]);

  if (visible.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
          <ShieldOff className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold">
            {t("friends.blocked.emptyTitle")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("friends.blocked.emptySubtitle")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-0.5 px-2 pb-3">
      <li className="px-3 pt-1 pb-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {t("friends.blocked.heading", { count: visible.length })}
      </li>

      {visible.map((item) => {
        const name = item.nickname ?? item.userId;

        return (
          <li
            key={item._id}
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-secondary/60"
          >
            <UserAvatar
              name={name}
              seed={item.userId}
              size="lg"
              className="opacity-60 grayscale"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-muted-foreground">
                {name}
              </p>
              <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
                {t("friends.blocked.description")}
              </p>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="shrink-0 rounded-xl"
              disabled={pendingId === item.userId}
              onClick={() => onUnblock?.(item.userId)}
            >
              {t("friends.blocked.unblock")}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

export default FriendsBlocked;
