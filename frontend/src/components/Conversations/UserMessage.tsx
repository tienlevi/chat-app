import { useTranslation } from "react-i18next";
import UserAvatar from "../UserAvatar";
import { formatListStamp } from "@/utils/datetime";
import { cn } from "@/lib/utils";
import type { IMessage } from "@/interfaces/message";
import type IUser from "@/interfaces/user";

interface Props {
  user: IUser;
  lastMessage?: IMessage;
  unreadCount: number;
  isActive: boolean;
  preview: string;
  currentUserId: string;
  onSelect: (userId: string) => void;
}

function UserMessage({
  user,
  lastMessage,
  unreadCount,
  isActive,
  preview,
  currentUserId,
  onSelect,
}: Props) {
  const { t, i18n } = useTranslation();

  return (
    <li>
      <button
        type="button"
        onClick={() => {
          if (user._id) onSelect(user._id);
        }}
        aria-current={isActive ? "true" : undefined}
        className={cn(
          "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors",
          "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
          isActive ? "bg-secondary" : "hover:bg-secondary/60",
        )}
      >
        <UserAvatar
          name={user.name}
          seed={user._id}
          src={user.avatar}
          size="lg"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold">{user.name}</span>
            {lastMessage ? (
              <span className="ml-auto shrink-0 text-[11px] text-muted-foreground tabular-nums">
                {formatListStamp(
                  lastMessage.createdAt,
                  i18n.resolvedLanguage ?? "en",
                )}
              </span>
            ) : null}
          </div>

          <div className="mt-1 flex items-center gap-2">
            <p
              className={cn(
                "min-w-0 flex-1 truncate text-[13px]",
                unreadCount > 0
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {lastMessage?.senderId === currentUserId
                ? t("chat.list.youPrefix", { text: preview })
                : preview}
            </p>

            {unreadCount > 0 ? (
              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground tabular-nums">
                {unreadCount}
              </span>
            ) : null}
          </div>
        </div>
      </button>
    </li>
  );
}

export default UserMessage;
