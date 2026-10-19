import ThemeToggle from "@/components/ThemeToggle";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAuth from "@/hooks/useAuth";
import useLogout from "@/hooks/useLogout";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

function NavBottom() {
  const { t } = useTranslation();
  const logout = useLogout();
  const { data: user } = useAuth();

  return (
    <div className="mt-auto flex flex-col items-center gap-2">
      <ThemeToggle />

      <Tooltip>
        <TooltipContent side="right">{t("chat.nav.settings")}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={logout}
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
        name={user?.name ?? ""}
        seed={user?._id}
        src={user?.avatar}
        size="md"
        className="mt-1"
      />
    </div>
  );
}

export default NavBottom;
