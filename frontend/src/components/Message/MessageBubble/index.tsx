import { useTranslation } from "react-i18next";
import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import { formatTime } from "@/utils/datetime";
import type { IMessage } from "@/interfaces/message";
import type IUser from "@/interfaces/user";
import MessageFiles from "./MessageFiles";

interface MessageBubbleProps {
  message: IMessage;
  author?: IUser;
  isOwn: boolean;
  showAvatar?: boolean;
}

function MessageBubble({
  message,
  author,
  isOwn,
  showAvatar = true,
}: MessageBubbleProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";
  const StatusIcon = message.isRead ? CheckCheck : Check;
  const statusKey = message.isRead ? "read" : "sent";

  return (
    <div
      className={cn(
        "flex items-end gap-2.5",
        isOwn ? "flex-row-reverse" : "flex-row",
      )}
    >
      <div className="w-8 shrink-0">
        {!isOwn && author && showAvatar ? (
          <UserAvatar
            name={author.name}
            seed={author._id}
            src={author.avatar}
            size="sm"
          />
        ) : null}
      </div>

      <div
        className={cn(
          "flex max-w-[min(560px,78%)] flex-col gap-1",
          isOwn ? "items-end" : "items-start",
        )}
      >
        <div className="group/bubble relative">
          <div
            className={cn(
              "rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed",
              isOwn
                ? `${message.text.trim() ? "bg-primary text-primary-foreground" : "bg-transparent"}`
                : "bg-secondary text-secondary-foreground",
            )}
          >
            {message.isDeleted ? (
              <p className="italic opacity-70">{t("chat.thread.deleted")}</p>
            ) : (
              <>
                {message.files.length ? (
                  <ul
                    className={cn(
                      "mt-2 flex flex-col gap-1.5",
                      isOwn
                        ? "text-primary-foreground"
                        : "text-secondary-foreground",
                    )}
                  >
                    {message.files.map((file) => {
                      return (
                        <MessageFiles
                          file={file}
                          isOwn={isOwn}
                          key={file._id}
                        />
                      );
                    })}
                  </ul>
                ) : null}
                <p className="whitespace-pre-wrap break-words">
                  {message.text}
                </p>
                <p
                  className={cn(
                    `text-[10px]`,
                    isOwn ? "text-accent" : "text-accent-foreground",
                  )}
                >
                  {formatTime(message.createdAt, locale)}
                </p>
              </>
            )}
          </div>
        </div>

        {message.emoji && !message.isDeleted ? (
          <div className="px-1">
            <span className="flex items-center rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5">
              <img
                src={`/emoji/${message.emoji}.png`}
                alt={t(`chat.emoji.${message.emoji}`)}
                className="size-4"
              />
            </span>
          </div>
        ) : null}

        {message.isRead ? (
          <div className="flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground">
            <span className="tabular-nums">
              {formatTime(message.updatedAt, locale)}
            </span>
            {isOwn ? (
              <StatusIcon
                aria-label={t(`chat.thread.status.${statusKey}`)}
                className={cn("size-3.5", message.isRead && "text-primary")}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default MessageBubble;
