import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MESSAGE_EMOJIS } from "@/constants/emoji";
import { Smile } from "lucide-react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  value: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  setValue: Dispatch<SetStateAction<string>>;
}

function Emoji({ value, textareaRef, setValue }: Props) {
  const { t } = useTranslation();
  const handleInsertEmoji = (char: string) => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? value.length;
    const caret = start + char.length;

    setValue((prev) => prev.slice(0, start) + char + prev.slice(end));

    requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(caret, caret);
    });
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground"
            >
              <Smile />
              <span className="sr-only">{t("chat.composer.emoji")}</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{t("chat.composer.emoji")}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        side="top"
        align="end"
        onCloseAutoFocus={(event) => event.preventDefault()}
        className="flex gap-1 rounded-2xl p-1.5"
      >
        {MESSAGE_EMOJIS.map(({ key, char }) => (
          <DropdownMenuItem
            key={key}
            onSelect={() => handleInsertEmoji(char)}
            aria-label={t(`chat.emoji.${key}`)}
            title={t(`chat.emoji.${key}`)}
            className="size-9 justify-center rounded-full p-1.5"
          >
            <img
              src={`/emoji/${key}.png`}
              alt=""
              className="size-6 transition-transform hover:scale-110"
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Emoji;
