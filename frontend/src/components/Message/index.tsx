import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { IMessage } from "@/interfaces/message";
import type IUser from "@/interfaces/user";
import MessageThread from "./MessageThread";
import MessageComposer from "./MessageComposer";
import MessageHeader from "./MessageHeader";
import { IFriend } from "@/interfaces/friend";
import useBlockFriend from "@/hooks/useBlockFriend";
import { Button } from "../ui/button";

interface Props {
  users: IUser[];
  friend: IFriend;
  messages: IMessage[];
  currentUserId: string;
  receiverId: string;
  mobilePane: "list" | "thread";
  onBack: () => void;
  onFetchMessages: () => void;
}

function Message({
  users,
  friend,
  messages,
  currentUserId,
  receiverId,
  mobilePane,
  onBack,
  onFetchMessages,
}: Props) {
  const { t } = useTranslation();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const receiver = users.find((user) => user._id === receiverId);
  const isBlockedByMe = friend.blockFriends.some((f) => f === receiver?._id);
  const isBlockedByThem = friend.blockedBy.some((f) => f === receiver?._id);
  const { mutate: handleUnblock } = useBlockFriend("unblock");

  return (
    <div
      className={cn(
        "flex w-full h-screen overflow-auto flex-col rounded-3xl border border-border bg-card",
        mobilePane === "list" && "hidden md:flex",
      )}
    >
      {receiver ? (
        <>
          <MessageHeader
            user={receiver}
            friend={friend}
            detailsOpen={detailsOpen}
            onToggleDetails={() => setDetailsOpen((open) => !open)}
            onBack={onBack}
          />
          <MessageThread
            messages={messages}
            participant={receiver}
            currentUserId={currentUserId}
            onFetchMessages={onFetchMessages}
          />
          {isBlockedByMe || isBlockedByThem ? (
            <div className="flex items-center justify-center gap-2 border-t border-border px-4 py-4 sm:px-6">
              <div className="text-center text-sm text-muted-foreground">
                {isBlockedByMe
                  ? t("chat.blocked.byMe")
                  : t("chat.blocked.byThem")}
              </div>
              {isBlockedByMe && (
                <Button onClick={() => handleUnblock(receiver._id || "")}>
                  {t("friends.blocked.unblock")}
                </Button>
              )}
            </div>
          ) : (
            <MessageComposer receiver={receiver} />
          )}
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center px-6 text-center">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              {t("chat.empty.title")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("chat.empty.subtitle")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Message;
