import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  BellOff,
  Info,
  MoreVertical,
  PencilLine,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserAvatar from "@/components/UserAvatar";
import type IUser from "@/interfaces/user";
import { FriendListItem } from "@/interfaces/friend";
import SetNicknameDialog from "./SetNicknameDialog";

interface Props {
  user: IUser;
  friend: FriendListItem | null;
  detailsOpen: boolean;
  onToggleDetails: () => void;
  onBack: () => void;
  className?: string;
}

function MessageHeader({
  user,
  friend,
  detailsOpen,
  onToggleDetails,
  onBack,
  className,
}: Props) {
  const { t } = useTranslation();
  const [isNicknameOpen, setIsNicknameOpen] = useState(false);

  return (
    <header
      className={cn(
        "flex items-center gap-3 border-b border-border px-4 py-3 sm:px-6",
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onBack}
        className="rounded-full md:hidden"
      >
        <ArrowLeft />
        <span className="sr-only">{t("chat.header.back")}</span>
      </Button>

      <UserAvatar
        name={user.name}
        seed={user._id}
        src={user.avatar}
        size="md"
      />
      <div className="text-[14px]">
        {friend?.nickname ? friend?.nickname : user.name}
      </div>

      <div className="flex items-center gap-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggleDetails}
              aria-pressed={detailsOpen}
              className={cn(
                "rounded-full text-muted-foreground",
                detailsOpen && "bg-secondary text-foreground",
              )}
            >
              <Info />
              <span className="sr-only">{t("chat.header.details")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("chat.header.details")}</TooltipContent>
        </Tooltip>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full text-muted-foreground"
            >
              <MoreVertical />
              <span className="sr-only">{t("chat.header.more")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onSelect={() => {
                if (!friend) {
                  toast.warning(t("chat.nickname.notFriend"));
                  return;
                }
                setIsNicknameOpen(true);
              }}
            >
              <PencilLine />
              {t("chat.nickname.action")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BellOff />
              {t("chat.header.mute")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Search />
              {t("chat.header.search")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash2 />
              {t("chat.header.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {friend && (
        <SetNicknameDialog
          user={user}
          friend={friend}
          open={isNicknameOpen}
          onOpenChange={setIsNicknameOpen}
        />
      )}
    </header>
  );
}

export default MessageHeader;
