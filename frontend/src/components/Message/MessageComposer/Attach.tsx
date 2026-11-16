import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface Props {
  onSelect: (files: File[]) => void;
  disabled?: boolean;
}

function Attach({ onSelect, disabled }: Props) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    if (selected.length) onSelect(selected);
    event.target.value = "";
  };

  return (
    <div className="shrink-0">
      <Input
        ref={inputRef}
        type="file"
        multiple
        onChange={handleChange}
        className="hidden"
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="shrink-0 rounded-full text-muted-foreground"
          >
            <Paperclip />
            <span className="sr-only">{t("chat.composer.attach")}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t("chat.composer.attach")}</TooltipContent>
      </Tooltip>
    </div>
  );
}

export default Attach;
