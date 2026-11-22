import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UserAvatar from "@/components/UserAvatar";
import useSetNickname from "@/hooks/useSetNickname";
import { NicknameFormValues, nicknameSchema } from "@/utils/validations";
import type IUser from "@/interfaces/user";
import { toast } from "sonner";
import { FriendListItem } from "@/interfaces/friend";

interface Props {
  user: IUser;
  friend: FriendListItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SetNicknameDialog({ user, friend, open, onOpenChange }: Props) {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => nicknameSchema(), [i18n.language]);
  const currentNickname = friend?.nickname ?? "";
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<NicknameFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nickname: currentNickname },
  });
  const { mutate: handleSetNickname, isPending } = useSetNickname();

  useEffect(() => {
    if (open) {
      reset({ nickname: currentNickname });
    }
  }, [open, currentNickname, reset]);

  function onSubmit(values: NicknameFormValues) {
    if (!friend) {
      toast.warning(t("chat.nickname.notFriend"));
      return;
    }

    handleSetNickname(
      { friendId: friend.userId, nickname: values.nickname },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("chat.nickname.title")}</DialogTitle>
          <DialogDescription>
            {t("chat.nickname.description", { name: user.name })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <div className="flex items-center gap-3 rounded-2xl bg-secondary px-3 py-2.5">
            <UserAvatar
              name={user.name}
              seed={user._id}
              src={user.avatar}
              size="md"
            />
            <span className="truncate text-sm font-semibold">{user.name}</span>
          </div>

          <Controller
            control={control}
            name="nickname"
            render={({ field, fieldState }) => (
              <div className="grid gap-2">
                <Label
                  htmlFor="nickname"
                  className={cn(fieldState.error && "text-destructive")}
                >
                  {t("chat.nickname.label")}
                </Label>
                <Input
                  id="nickname"
                  autoComplete="off"
                  placeholder={user.name}
                  aria-invalid={fieldState.invalid}
                  aria-describedby="nickname-message"
                  className="h-11 rounded-xl"
                  {...field}
                />
                <p
                  id="nickname-message"
                  className={cn(
                    "text-xs text-muted-foreground",
                    fieldState.error && "text-sm text-destructive",
                  )}
                >
                  {fieldState.error?.message ?? t("chat.nickname.hint")}
                </p>
              </div>
            )}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="rounded-xl">
                {t("common.cancel")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending || !isDirty}
              className="rounded-xl"
            >
              {t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SetNicknameDialog;
