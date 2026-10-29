import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { IMessage } from "@/interfaces/message";
import type IUser from "@/interfaces/user";
import MessageThread from "./MessageThread";
import MessageComposer from "./MessageComposer";
import MessageHeader from "./MessageHeader";

interface Props {
  users: IUser[];
  messages: IMessage[];
  currentUserId: string;
  receiverId: string;
  mobilePane: "list" | "thread";
  onBack: () => void;
}

function Message({
  users,
  messages,
  currentUserId,
  receiverId,
  mobilePane,
  onBack,
}: Props) {
  const { t } = useTranslation();

  const [detailsOpen, setDetailsOpen] = useState(false);

  const receiver = users.find((user) => user._id === receiverId);

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
            detailsOpen={detailsOpen}
            onToggleDetails={() => setDetailsOpen((open) => !open)}
            onBack={onBack}
          />
          <MessageThread
            messages={messages}
            participant={receiver}
            currentUserId={currentUserId}
          />
          <MessageComposer receiver={receiver} />
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
