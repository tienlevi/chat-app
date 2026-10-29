import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Mic, Paperclip, SendHorizontal, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import IUser from "@/interfaces/user";
import useMessageSocket from "@/hooks/useMessageSocket";

const MAX_HEIGHT = 160;

interface Props {
  receiver: IUser;
  className?: string;
}

function MessageComposer({ receiver, className }: Props) {
  const { sendMessageDirect } = useMessageSocket();
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_HEIGHT)}px`;
  }, [value]);

  const handleSend = useCallback(() => {
    const text = value.trim();
    if (!text) return;

    sendMessageDirect(receiver._id || "", text);
    setValue("");
    textareaRef.current?.focus();
  }, [value]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const canSend = value.trim().length > 0;

  return (
    <div className={cn("px-4 pb-4 sm:px-6", className)}>
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-end gap-1.5 rounded-3xl border border-border bg-secondary/60 p-1.5 transition-colors focus-within:border-ring/60 focus-within:bg-card">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-muted-foreground"
              >
                <Paperclip />
                <span className="sr-only">{t("chat.composer.attach")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("chat.composer.attach")}</TooltipContent>
          </Tooltip>

          <Textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("chat.composer.placeholder", {
              name: receiver.name,
            })}
            aria-label={t("chat.composer.placeholder", { name: receiver.name })}
            className="min-h-9 resize-none border-none bg-transparent py-2 text-[14px] shadow-none focus-visible:ring-0 dark:bg-transparent"
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-muted-foreground"
              >
                <Smile />
                <span className="sr-only">{t("chat.composer.emoji")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("chat.composer.emoji")}</TooltipContent>
          </Tooltip>

          <Button
            type="button"
            size="icon"
            onClick={handleSend}
            disabled={!canSend}
            aria-label={
              canSend ? t("chat.composer.send") : t("chat.composer.voice")
            }
            className="rounded-full transition-transform active:scale-95"
          >
            {canSend ? <SendHorizontal /> : <Mic />}
          </Button>
        </div>

        <p className="mt-2 px-4 text-[11px] text-muted-foreground">
          {t("chat.composer.hint")}
        </p>
      </div>
    </div>
  );
}

export default MessageComposer;
