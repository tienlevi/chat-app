import { useRef } from "react";
import { Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import UserAvatar from "@/components/UserAvatar";
import type IUser from "@/interfaces/user";

interface Props {
  user: IUser;
  src?: string;
  disabled?: boolean;
  onSelect: (file: File) => void;
}

function AvatarPicker({ user, src, disabled, onSelect }: Props) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(t("chat.profile.invalidImage"));
      return;
    }
    onSelect(file);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={openPicker}
        disabled={disabled}
        className="group relative rounded-2xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <UserAvatar name={user.name} seed={user._id} src={src} size="2xl" />
        <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Camera className="size-6" />
        </span>
        <span className="sr-only">{t("chat.profile.changeAvatar")}</span>
      </button>
      <button
        type="button"
        onClick={openPicker}
        disabled={disabled}
        aria-hidden
        tabIndex={-1}
        className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
      >
        {t("chat.profile.changeAvatar")}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

export default AvatarPicker;
