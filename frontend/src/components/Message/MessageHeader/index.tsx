import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import type IUser from "@/interfaces/user";
import { IFriend } from "@/interfaces/friend";
import SetNicknameDialog from "./SetNicknameDialog";
import InfoDialog from "./InfoDialog";

interface Props {
  user: IUser;
  friend: IFriend;
  detailsOpen: boolean;
  onToggleDetails: () => void;
  onBack: () => void;
  className?: string;
}

function MessageHeader({
  user,
  friend,
  detailsOpen,
  onBack,
  className,
}: Props) {
  const { t } = useTranslation();
  const [isNicknameOpen, setIsNicknameOpen] = useState(false);

  const friendDetail = friend.friends.find((f) => f.userId === user._id);
  const isBlocked = friend.blockFriends.some((f) => f === user._id);

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
        {friendDetail?.nickname ? friendDetail?.nickname : user.name}
      </div>

      <div className="flex items-center gap-0.5">
        <InfoDialog
          detailsOpen={detailsOpen}
          friendDetail={friendDetail}
          isBlocked={isBlocked}
          user={user}
          setIsNicknameOpen={setIsNicknameOpen}
        />
      </div>

      {friendDetail && (
        <SetNicknameDialog
          user={user}
          friend={friendDetail}
          open={isNicknameOpen}
          onOpenChange={setIsNicknameOpen}
        />
      )}
    </header>
  );
}

export default MessageHeader;
