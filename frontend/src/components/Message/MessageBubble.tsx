import { useTranslation } from "react-i18next";
import { Check, CheckCheck, FileText, Film, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import { formatTime } from "@/utils/datetime";
import type { ChatParticipant } from "@/interfaces/chat";
import { ChatMessage, MessageFileType } from "@/interfaces/message";

const FILE_ICON: Record<MessageFileType, typeof FileText> = {
  file: FileText,
  image: ImageIcon,
  video: Film,
};

const fileName = (url: string): string => {
  const segments = url.split("/");
  return decodeURIComponent(segments[segments.length - 1] || url);
};

interface MessageBubbleProps {
  message: ChatMessage;
  author?: ChatParticipant;
  isOwn: boolean;
  isFirstOfGroup: boolean;
  isLastOfGroup: boolean;
}

function MessageBubble({
  message,
  author,
  isOwn,
  isFirstOfGroup,
  isLastOfGroup,
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
        isFirstOfGroup ? "mt-4" : "mt-0.5",
      )}
    >
      <div className="w-8 shrink-0">
        {!isOwn && isLastOfGroup && author ? (
          <UserAvatar name={author.name} seed={author.id} size="sm" />
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
              "rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed",
              isOwn
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground",
              isOwn
                ? cn(
                    !isFirstOfGroup && "rounded-tr-md",
                    !isLastOfGroup && "rounded-br-md",
                  )
                : cn(
                    !isFirstOfGroup && "rounded-tl-md",
                    !isLastOfGroup && "rounded-bl-md",
                  ),
            )}
          >
            {message.isDeleted ? (
              <p className="italic opacity-70">{t("chat.thread.deleted")}</p>
            ) : (
              <>
                <p className="whitespace-pre-wrap break-words">
                  {message.text}
                </p>

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
                      const Icon = FILE_ICON[file.type];

                      return (
                        <li key={file._id}>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className={cn(
                              "flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-opacity hover:opacity-90",
                              isOwn ? "bg-black/15" : "bg-background/70",
                            )}
                          >
                            <span
                              className={cn(
                                "flex size-8 shrink-0 items-center justify-center rounded-lg",
                                isOwn ? "bg-black/20" : "bg-secondary",
                              )}
                            >
                              <Icon className="size-4" />
                            </span>
                            <span className="min-w-0 truncate text-[13px] font-medium">
                              {fileName(file.url)}
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
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

        {isLastOfGroup ? (
          <div className="flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground">
            <span className="tabular-nums">
              {formatTime(message.createdAt, locale)}
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
