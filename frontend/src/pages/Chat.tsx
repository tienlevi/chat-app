import { TooltipProvider } from "@/components/ui/tooltip";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NavRail from "@/components/NavRail";
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
    <TooltipProvider>
      <div className="relative flex h-svh flex-col overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-32 size-[520px] rounded-full bg-primary/12 blur-3xl animate-float-slow" />
          <div className="absolute -right-40 -bottom-48 size-[560px] rounded-full bg-accent/40 blur-3xl animate-float-slower" />
          <div className="absolute inset-0 bg-grain opacity-[0.035] mix-blend-multiply dark:opacity-[0.05] dark:mix-blend-screen" />
        </div>

        <LanguageSwitcher className="absolute top-6 right-8 z-20 hidden xl:inline-flex" />

        <div className="flex min-h-0 flex-1 gap-3 p-3">
          <NavRail />
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
        </div>
      </div>
    </TooltipProvider>
  );
}

export default Chat;
