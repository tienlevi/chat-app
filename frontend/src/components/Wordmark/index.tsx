import { Flame } from "lucide-react";
import { useTranslation } from "react-i18next";

function Wordmark({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Flame className="size-4" strokeWidth={2.5} />
      </span>
      <span className="font-display text-xl font-semibold tracking-tight">
        {t("common.appName")}
      </span>
    </div>
  );
}

export default Wordmark;
