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
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ProfileDialog from "./ProfileDialog";

function NavBottom() {
  const { t } = useTranslation();
  const logout = useLogout();
  const { data: user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            disabled={!user}
            className="mt-1 rounded-2xl transition-opacity hover:opacity-80 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <UserAvatar
              name={user?.name ?? ""}
              seed={user?._id}
              src={user?.avatar}
              size="md"
            />
            <span className="sr-only">{t("chat.profile.open")}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">{t("chat.profile.open")}</TooltipContent>
      </Tooltip>

      {user && (
        <ProfileDialog
          user={user}
          open={isProfileOpen}
          onOpenChange={setIsProfileOpen}
        />
      )}
    </div>
  );
}

export default NavBottom;
