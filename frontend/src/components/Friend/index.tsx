import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FriendTab } from "@/interfaces/friend";
import UserAvatar from "../UserAvatar";
// import FriendsRequest from "./FriendsRequest";
import FriendsBlocked from "./FriendsBlocked";
import FriendHeader from "./FriendHeader";
import useUsers from "@/hooks/useUsers";
import useDebounce from "@/hooks/useDebounce";
import { Button } from "../ui/button";
import useAddFriend from "@/hooks/useAddFriend";
import useFriends from "@/hooks/useFriends";
import useAuth from "@/hooks/useAuth";

function Friend() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const debounce = useDebounce(query);
  const [tab, setTab] = useState<FriendTab>("all");

  const { data: user } = useAuth();
  const { data: users, isLoading } = useUsers(debounce);
  const friendList = users.filter((u) => u._id !== user?._id);
  const { friend } = useFriends();
  const { mutate: handleAddFriend } = useAddFriend();

  return (
    <section
      className={cn(
        "flex w-full flex-1 flex-col rounded-3xl border border-border bg-card",
      )}
    >
      <FriendHeader
        counts={users.length || 0}
        query={query}
        setQuery={setQuery}
        tab={tab}
        setTab={setTab}
      />

      <ScrollArea className="min-h-0 flex-1">
        {tab === "all" ? (
          <ul className="flex flex-col gap-0.5 px-2 pb-3">
            {isLoading ? (
              <div>Loading....</div>
            ) : (
              friendList.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center justify-between rounded-2xl px-3 py-2.5 transition-colors hover:bg-secondary/60"
                >
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      src={user.avatar}
                      name={user.name}
                      seed={user._id}
                      size="lg"
                    />

                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                      {user.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      disabled={friend?.friendsRequest?.some(
                        (f) => f === user._id,
                      )}
                      onClick={() =>
                        handleAddFriend({ friendId: user._id || "" })
                      }
                      className="cursor-pointer"
                    >
                      {friend?.friendsRequest?.some((f) => f === user._id)
                        ? "Request was send"
                        : "Send request"}
                    </Button>
                  </div>
                </li>
              ))
            )}

            {users.length === 0 ? (
              <li className="px-4 py-12 text-center text-sm text-muted-foreground">
                {t("friends.empty")}
              </li>
            ) : null}
          </ul>
        ) : null}

        {/* {tab === "requests" ? (
          <FriendsRequest
            requests={friend?.friendsRequest ?? []}
            query={query}
          />
        ) : null} */}
        {tab === "blocked" ? (
          <FriendsBlocked blocked={[]} query={query} />
        ) : null}
      </ScrollArea>
    </section>
  );
}

export default Friend;
