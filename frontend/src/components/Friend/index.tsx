import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FriendTab } from "@/interfaces/friend";
// import FriendsRequest from "./FriendsRequest";
import FriendsBlocked from "./FriendsBlocked";
import FriendHeader from "./FriendHeader";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/query-key";
import IUser from "@/interfaces/user";
import { searchFriends } from "@/services/friends";
import SearchFriends from "./SearchFriends";
import CommonFriends from "./CommonFriends";

function Friend() {
  const [query, setQuery] = useState("");
  const debounce = useDebounce(query);
  const [tab, setTab] = useState<FriendTab>("all");

  const { data: friends, isLoading } = useQuery<IUser[]>({
    queryKey: [QUERY_KEY.FRIENDS, debounce],
    queryFn: async () => {
      return await searchFriends(debounce);
    },
    initialData: [],
  });

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
          <SearchFriends friends={friends} isLoading={isLoading} />
        ) : null}
        {tab === "common-friends" && <></>}
        {/* {tab === "requests" ? (
          <FriendsRequest
            requests={friend?.friendsRequest ?? []}
            query={query}
          />
        ) : null} */}
        {tab === "common-friends" && (
          <CommonFriends friends={friends} isLoading={isLoading} />
        )}
        {tab === "blocked" && <FriendsBlocked blocked={[]} query={query} />}
      </ScrollArea>
    </section>
  );
}

export default Friend;
