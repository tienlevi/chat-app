import { Dialog, DialogContent } from "@/components/ui/dialog";

import type IUser from "@/interfaces/user";
import ProfileEditor from "./ProfileEditor";

interface Props {
  user: IUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ProfileDialog({ user, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <ProfileEditor user={user} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default ProfileDialog;
