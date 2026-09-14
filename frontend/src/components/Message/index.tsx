import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { getThread } from "@/utils/message";
import type { IMessage } from "@/interfaces/message";
import type IUser from "@/interfaces/user";
import MessageThread from "./MessageThread";
import MessageComposer from "./MessageComposer";
import MessageHeader from "./MessageHeader";

interface Props {
  users: IUser[];
  messages: IMessage[];
  currentUserId: string;
  activeId?: string;
  mobilePane: "list" | "thread";
  onBack: () => void;
}

function Message({
  users,
  messages,
  currentUserId,
  activeId,
  mobilePane,
  onBack,
}: Props) {
  const { t } = useTranslation();

  const [detailsOpen, setDetailsOpen] = useState(false);

  const activeUser = useMemo(
    () => (activeId ? users.find((user) => user._id === activeId) : undefined),
    [users, activeId],
  );

  const thread = useMemo(
    () => getThread(messages, currentUserId, activeId),
    [messages, currentUserId, activeId],
  );

  return (
    <div
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col rounded-3xl border border-border bg-card",
        mobilePane === "list" && "hidden md:flex",
      )}
    >
      {activeUser ? (
        <>
          <MessageHeader
            user={activeUser}
            detailsOpen={detailsOpen}
            onToggleDetails={() => setDetailsOpen((open) => !open)}
            onBack={onBack}
          />
          <MessageThread
            messages={thread}
            participant={activeUser}
            currentUserId={currentUserId}
          />
          <MessageComposer recipient={activeUser.name} />
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
