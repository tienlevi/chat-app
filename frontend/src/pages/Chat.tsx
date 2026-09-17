import Conversations from "@/components/Conversations";
import Message from "@/components/Message";
import { useCallback, useState } from "react";
import type { IMessage } from "@/interfaces/message";
import { CURRENT_USER_ID, MESSAGES, USERS } from "@/constants/mock-chat";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";

function Chat() {
  const { data: user } = useAuth();
  console.log("🚀 ~ Home ~ user:", user);
  const [messages, setMessages] = useState<IMessage[]>(MESSAGES);
  const [activeId, setActiveId] = useState(USERS[0]?._id);
  const [mobilePane, setMobilePane] = useState<"list" | "thread">("list");

  const handleSelect = useCallback((userId: string) => {
    setActiveId(userId);
    setMobilePane("thread");
    setMessages((current) =>
      current.map((message) =>
        message.senderId === userId &&
        message.receiverId === CURRENT_USER_ID &&
        !message.isRead
          ? { ...message, isRead: true }
          : message,
      ),
    );
  }, []);

  return (
    <div className="flex gap-3.5">
      <Conversations
        users={USERS}
        messages={messages}
        currentUserId={CURRENT_USER_ID}
        activeId={activeId}
        onSelect={handleSelect}
        className={cn(mobilePane === "thread" && "hidden md:flex")}
      />
      <Message
        users={USERS}
        messages={messages}
        currentUserId={CURRENT_USER_ID}
        activeId={activeId}
        mobilePane={mobilePane}
        onBack={() => setMobilePane("list")}
      />
    </div>
  );
}

export default Chat;
