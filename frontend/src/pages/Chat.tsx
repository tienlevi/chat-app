import Conversations from "@/components/Conversations";
import Message from "@/components/Message";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";
import useFriends from "@/hooks/useFriends";
import useMessages from "@/hooks/useMessages";

function Chat() {
  const [searchParams] = useSearchParams();
  const receiverId = searchParams.get("receiverId") || "";
  const { data: user } = useAuth();
  const { users } = useFriends();
  const { receiverMessages, senderMessages } = useMessages(receiverId);
  const [mobilePane, setMobilePane] = useState<"list" | "thread">("list");
  const currentUserId = user?._id || "";

  return (
    <div className="flex gap-3.5">
      <Conversations
        users={users}
        receiverMessages={receiverMessages}
        senderMessages={senderMessages}
        currentUserId={currentUserId}
        activeId={receiverId}
        className={cn(mobilePane === "thread" && "hidden md:flex")}
      />
      <Message
        users={users}
        messages={receiverMessages}
        currentUserId={currentUserId}
        activeId={receiverId}
        mobilePane={mobilePane}
        onBack={() => setMobilePane("list")}
      />
    </div>
  );
}

export default Chat;
