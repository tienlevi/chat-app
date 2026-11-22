import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useBlockFriend from "@/hooks/useBlockFriend";
import { FriendListItem } from "@/interfaces/friend";
import IUser from "@/interfaces/user";
import { cn } from "@/lib/utils";
import { Ban, Info, PencilLine } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface Props {
  user: IUser;
  friendDetail: FriendListItem;
  isBlocked: boolean;
  detailsOpen: boolean;
  setIsNicknameOpen: (open: boolean) => void;
}

function InfoDialog({
  user,
  friendDetail,
  isBlocked,
  detailsOpen,
  setIsNicknameOpen,
}: Props) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: handleBlock } = useBlockFriend("block");
  const { mutate: handleUnblock } = useBlockFriend("unblock");

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">User info</DialogTitle>
          <DialogDescription className="sr-only">{user.name}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3">
          <img src={user.avatar} alt="" className="w-12 h-12 rounded-full" />
          <span className="text-lg font-bold text-foreground">{user.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={"default"}
            className="cursor-pointer"
            onClick={() => {
              if (!friendDetail) {
                toast.warning(t("chat.nickname.notFriend"));
                return;
              }
              setIsNicknameOpen(true);
            }}
          >
            <PencilLine /> <span>Set nickname</span>
          </Button>
          <Button
            onClick={() =>
              isBlocked
                ? handleUnblock(user._id || "")
                : handleBlock(user._id || "")
            }
            variant={"destructive"}
            className="cursor-pointer"
          >
            <Ban />
            <span>
              {isBlocked ? t("friends.blocked.unblock") : t("friends.block")}
            </span>
          </Button>
        </div>
      </DialogContent>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn(
            "rounded-full text-muted-foreground",
            detailsOpen && "bg-secondary text-foreground",
          )}
        >
          <Info />
          <span className="sr-only">{t("chat.header.details")}</span>
        </Button>
      </DialogTrigger>
    </Dialog>
  );
}

export default InfoDialog;
