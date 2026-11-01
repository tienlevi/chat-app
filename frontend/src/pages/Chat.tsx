import Conversations from "@/components/Conversations";
import Message from "@/components/Message";
import { useEffect, useEffectEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";
import useFriends from "@/hooks/useFriends";
import useMessages from "@/hooks/useMessages";
import useSocketStore from "@/stores/useSocketStore";
import useMessageSocket from "@/hooks/useMessageSocket";

function Chat() {
  const [searchParams] = useSearchParams();
  const receiverId = searchParams.get("receiverId") || "";
  const { data: user } = useAuth();
  const { users } = useFriends();
  const { receiverMessages, senderMessages, latestMessages } =
    useMessages(receiverId);
  const [mobilePane, setMobilePane] = useState<"list" | "thread">("list");
  const currentUserId = user?._id || "";
  const { messages, setMessages, setActiveReceiverId } = useSocketStore();
  const { handleReadMessages } = useMessageSocket();
  const hasUnread = messages.some(
    (m) => m.isRead === false && m.senderId === receiverId,
  );
  const updateMessages = useEffectEvent(() => {
    handleReadMessages(receiverId);
  });

  useEffect(() => {
    if (receiverId && hasUnread) updateMessages();
  }, [receiverId, hasUnread]);

  useEffect(() => {
    setActiveReceiverId(receiverId);
    setMessages(receiverMessages);
  }, [receiverMessages, receiverId]);

  return (
    <div className="flex gap-3.5">
      <Conversations
        users={users}
        latestMessages={latestMessages}
        senderMessages={senderMessages}
        currentUserId={currentUserId}
        activeId={receiverId}
        className={cn(mobilePane === "thread" && "hidden md:flex")}
      />
      <Message
        users={users}
        messages={messages}
        currentUserId={currentUserId}
        receiverId={receiverId}
        mobilePane={mobilePane}
        onBack={() => setMobilePane("list")}
      />
    </div>
  );
}

export default Chat;
