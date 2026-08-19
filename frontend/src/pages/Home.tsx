import { useTranslation } from "react-i18next";
import LoginForm from "@/components/LoginForm";
import Wordmark from "@/components/Wordmark";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-6 py-12">
      <LanguageSwitcher className="absolute top-6 right-6" />
      <ThemeToggle className="absolute top-6 right-28" />
      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Wordmark className="mb-8" />

        <div className="rounded-2xl border border-border bg-card px-8 py-10 shadow-sm sm:px-10 sm:py-12">
          <div className="mb-8 flex flex-col gap-1.5">
            <h1 className="font-display text-4xl leading-tight font-semibold text-foreground">
              {t("auth.login.title")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("auth.login.subtitle")}
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
