import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { SUPPORTED_LANGUAGES } from "@/utils/i18n";

const LANGUAGE_LABELS = {
  en: "EN",
  vi: "VI",
};

function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border bg-card p-0.5",
        className,
      )}
    >
      {SUPPORTED_LANGUAGES.map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => i18n.changeLanguage(lng)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
            currentLanguage === lng
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {LANGUAGE_LABELS[lng]}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
