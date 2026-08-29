import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/interfaces/chat";
import MessageThread from "./MessageThread";
import MessageComposer from "./MessageComposer";
import MessageHeader from "./MessageHeader";

interface Props {
  conversations: Conversation[];
  activeId: string;
  mobilePane: "list" | "thread";
  onBack: () => void;
}

function Message({ conversations, activeId, mobilePane, onBack }: Props) {
  const { t } = useTranslation();

  const [detailsOpen, setDetailsOpen] = useState(false);

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeId),
    [conversations, activeId],
  );

  return (
    <div
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col rounded-3xl border border-border bg-card",
        mobilePane === "list" && "hidden md:flex",
      )}
    >
      {activeConversation ? (
        <>
          <MessageHeader
            conversation={activeConversation}
            detailsOpen={detailsOpen}
            onToggleDetails={() => setDetailsOpen((open) => !open)}
            onBack={onBack}
          />
          <MessageThread conversation={activeConversation} />
          <MessageComposer recipient={activeConversation.name} />
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
