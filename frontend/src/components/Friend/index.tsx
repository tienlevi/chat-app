import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FriendTab, IFriend } from "@/interfaces/friend";
import UserAvatar from "../UserAvatar";
import FriendsRequest from "./FriendsRequest";
import FriendsBlocked from "./FriendsBlocked";
import FriendHeader from "./FriendHeader";
import useUsers from "@/hooks/useUsers";
import useDebounce from "@/hooks/useDebounce";

interface FriendProps {
  friend?: IFriend;
}

function Friend({ friend }: FriendProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const debounce = useDebounce(query);
  const [tab, setTab] = useState<FriendTab>("all");

  const { data: friends, isLoading } = useUsers(debounce);

  return (
    <section
      className={cn(
        "flex w-full flex-1 flex-col rounded-3xl border border-border bg-card",
      )}
    >
      <FriendHeader
        counts={friends.length || 0}
        query={query}
        setQuery={setQuery}
        tab={tab}
        setTab={setTab}
      />

      <ScrollArea className="min-h-0 flex-1">
        {tab === "all" ? (
          <ul className="flex flex-col gap-0.5 px-2 pb-3">
            {friends.map((friend) => (
              <li
                key={friend._id}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-secondary/60"
              >
                <UserAvatar name={friend.name} seed={friend._id} size="lg" />

                <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                  {friend.name}
                </span>
              </li>
            ))}

            {friends.length === 0 ? (
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
          <FriendsBlocked blocked={[]} query={query} />
        ) : null}
      </ScrollArea>
    </section>
  );
}

export default Friend;
