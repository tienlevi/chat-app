import Conversations from "@/components/Conversations";
import Message from "@/components/Message";
import { useCallback, useState } from "react";
import { Conversation } from "@/interfaces/chat";
import { CONVERSATIONS } from "@/constants/mock-chat";
import { cn } from "@/lib/utils";

function Chat() {
  const [conversations, setConversations] =
    useState<Conversation[]>(CONVERSATIONS);
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [mobilePane, setMobilePane] = useState<"list" | "thread">("list");

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
    setMobilePane("thread");
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === id
          ? { ...conversation, unreadCount: 0 }
          : conversation,
      ),
    );
  }, []);

  return (
    <>
      <Conversations
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelect}
        className={cn(mobilePane === "thread" && "hidden md:flex")}
      />
      <Message
        conversations={conversations}
        activeId={activeId}
        mobilePane={mobilePane}
        onBack={() => setMobilePane("list")}
      />
    </>
  );
}

export default Chat;
