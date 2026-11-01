import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Paperclip } from "lucide-react";
import { useTranslation } from "react-i18next";

function Attach() {
  const { t } = useTranslation();

  return (
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
  );
}

export default Attach;
