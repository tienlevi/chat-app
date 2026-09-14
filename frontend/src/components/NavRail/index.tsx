import { useTranslation } from "react-i18next";
import { MessagesSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMAGES } from "@/constants/images";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, useLocation } from "react-router-dom";
import NavBottom from "./NavBottom";

const NAV_ITEMS: {
  id: string;
  path: string;
  icon: typeof MessagesSquare;
  badge?: number;
}[] = [
  { id: "chats", path: "/chat", icon: MessagesSquare, badge: 8 },
  { id: "contacts", path: "/friends", icon: Users },
];

function NavRail() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <>
      <img
        src={IMAGES.icon}
        alt={t("common.appName")}
        className="mb-4 size-9 rounded-xl"
      />

      {NAV_ITEMS.map(({ id, icon: Icon, badge, path }) => {
        const isActive = location.pathname === path;

        return (
          <Tooltip key={id}>
            <TooltipTrigger asChild>
              <Link
                to={path}
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
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{t(`chat.nav.${id}`)}</TooltipContent>
          </Tooltip>
        );
      })}

      <NavBottom />
    </>
  );
}

export default NavRail;
