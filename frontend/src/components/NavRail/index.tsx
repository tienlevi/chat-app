import { useTranslation } from "react-i18next";
import { Archive, Bookmark, LogOut, MessagesSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMAGES } from "@/constants/images";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ThemeToggle from "@/components/ThemeToggle";
import UserAvatar from "@/components/UserAvatar";
import { CURRENT_USER_ID, PARTICIPANTS } from "@/constants/mock-chat";

type NavItemId = "chats" | "contacts" | "saved" | "archive";

const NAV_ITEMS: {
  id: NavItemId;
  icon: typeof MessagesSquare;
  badge?: number;
}[] = [
  { id: "chats", icon: MessagesSquare, badge: 8 },
  { id: "contacts", icon: Users },
  { id: "saved", icon: Bookmark },
  { id: "archive", icon: Archive },
];

interface NavRailProps {
  active?: NavItemId;
  onSelect?: (id: NavItemId) => void;
  className?: string;
}

function NavRail({ active = "chats", onSelect, className }: NavRailProps) {
  const { t } = useTranslation();
  const me = PARTICIPANTS[CURRENT_USER_ID];

  return (
    <nav
      aria-label={t("chat.nav.label")}
      className={cn(
        "hidden w-[76px] shrink-0 flex-col items-center gap-1 rounded-3xl border border-border bg-card py-5 md:flex",
        className,
      )}
    >
      <img
        src={IMAGES.icon}
        alt={t("common.appName")}
        className="mb-4 size-9 rounded-xl"
      />

      {NAV_ITEMS.map(({ id, icon: Icon, badge }) => {
        const isActive = id === active;

        return (
          <Tooltip key={id}>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => onSelect?.(id)}
                className={cn(
                  "relative flex size-11 items-center justify-center rounded-2xl text-muted-foreground transition-colors",
                  "hover:bg-secondary hover:text-foreground",
                  "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                  isActive &&
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                )}
              >
                <Icon className="size-[19px]" />
                {badge && !isActive ? (
                  <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-card" />
                ) : null}
                <span className="sr-only">{t(`chat.nav.${id}`)}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{t(`chat.nav.${id}`)}</TooltipContent>
          </Tooltip>
        );
      })}

      <div className="mt-auto flex flex-col items-center gap-2">
        <ThemeToggle />

        <Tooltip>
          <TooltipContent side="right">{t("chat.nav.settings")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full text-muted-foreground"
            >
              <LogOut />
              <span className="sr-only">{t("chat.nav.logout")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{t("chat.nav.logout")}</TooltipContent>
        </Tooltip>

        <UserAvatar
          name={me.name}
          seed={me.id}
          status={me.status}
          size="md"
          className="mt-1"
        />
      </div>
    </nav>
  );
}

export default NavRail;
