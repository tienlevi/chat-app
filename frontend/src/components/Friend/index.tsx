import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BellOff } from "lucide-react";
import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";

import type { FriendTab, IFriend } from "@/interfaces/friend";
import UserAvatar from "../UserAvatar";
import FriendsRequest from "./FriendsRequest";
import FriendsBlocked from "./FriendsBlocked";
import FriendHeader from "./FriendHeader";

interface FriendProps {
  friend?: IFriend;
}

function Friend({ friend }: FriendProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<FriendTab>("all");

  const friends = useMemo(
    () => (friend?.friends ?? []).filter((item) => !item.isBlocked),
    [friend],
  );

  const blocked = useMemo(
    () => (friend?.friends ?? []).filter((item) => item.isBlocked),
    [friend],
  );

  const counts: Record<FriendTab, number> = {
    all: friends.length,
    requests: friend?.friendsRequest.length ?? 0,
    blocked: blocked.length,
  };

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return friends;

    return friends.filter((item) =>
      (item.nickname ?? item.userId).toLowerCase().includes(needle),
    );
  }, [friends, query]);

  return (
    <section
      className={cn(
        "flex w-full flex-1 flex-col rounded-3xl border border-border bg-card",
      )}
    >
      <FriendHeader
        counts={counts}
        query={query}
        setQuery={setQuery}
        tab={tab}
        setTab={setTab}
      />

      <ScrollArea className="min-h-0 flex-1">
        {tab === "all" ? (
          <ul className="flex flex-col gap-0.5 px-2 pb-3">
            {visible.map((item) => {
              const name = item.nickname ?? item.userId;

              return (
                <li
                  key={item._id}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-secondary/60"
                >
                  <UserAvatar name={name} seed={item.userId} size="lg" />

                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                    {name}
                  </span>

                  {item.mutedNotification ? (
                    <BellOff
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-label={t("friends.muted")}
                    />
                  ) : null}
                </li>
              );
            })}

            {visible.length === 0 ? (
              <li className="px-4 py-12 text-center text-sm text-muted-foreground">
                {t("friends.empty")}
              </li>
            ) : null}
          </ul>
        ) : null}

        {tab === "requests" ? (
          <FriendsRequest
            requests={friend?.friendsRequest ?? []}
            query={query}
          />
        ) : null}
        {tab === "blocked" ? (
          <FriendsBlocked blocked={blocked} query={query} />
        ) : null}
      </ScrollArea>
    </section>
  );
}

export default Friend;
