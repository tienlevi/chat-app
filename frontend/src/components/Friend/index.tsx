import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FriendTab } from "@/interfaces/friend";
import FriendsBlocked from "./FriendsBlocked";
import FriendHeader from "./FriendHeader";
import useDebounce from "@/hooks/useDebounce";
import SearchFriends from "./SearchFriends";
import CommonFriends from "./CommonFriends";
import useFriends from "@/hooks/useFriends";
import FriendRequests from "./FriendRequests";

function Friend() {
  const [query, setQuery] = useState("");
  const debounce = useDebounce(query);
  const [tab, setTab] = useState<FriendTab>("all");
  const { friend, users, isLoadingUsers } = useFriends(debounce);
  const commonFriends = users.filter((user) =>
    friend?.friends?.some((f) => f.userId === user._id),
  );
  const friendRequests = users.filter((user) =>
    friend?.friendRequests?.some((f) => f === user._id),
  );

  return (
    <section
      className={cn(
        "flex w-full flex-1 flex-col rounded-3xl border border-border bg-card",
      )}
    >
      <FriendHeader
        query={query}
        setQuery={setQuery}
        tab={tab}
        setTab={setTab}
      />

      <ScrollArea className="min-h-0 flex-1">
        {tab === "all" && (
          <SearchFriends
            friend={friend}
            users={users}
            isLoading={isLoadingUsers}
          />
        )}
        {tab === "requests" && (
          <FriendRequests
            requests={friendRequests}
            isLoading={isLoadingUsers}
          />
        )}
        {tab === "common-friends" && (
          <CommonFriends friends={commonFriends} isLoading={isLoadingUsers} />
        )}
        {tab === "blocked" && <FriendsBlocked blocked={[]} query={query} />}
      </ScrollArea>
    </section>
  );
}

export default Friend;
