import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useObjectUrl from "@/hooks/useObjectUrl";
import useUpdateProfile from "@/hooks/useUpdateProfile";
import { ProfileFormValues, profileSchema } from "@/utils/validations";
import type IUser from "@/interfaces/user";
import AvatarCropStep from "./AvatarCropStep";
import AvatarPicker from "./AvatarPicker";

interface Props {
  user: IUser;
  onDone: () => void;
}

function ProfileEditor({ user, onDone }: Props) {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => profileSchema(), [i18n.language]);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarPreview = useObjectUrl(avatarFile);
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: user.name },
  });

  const onSubmit = ({ name }: ProfileFormValues) => {
    const nameChanged = name !== user.name;
    if (!nameChanged && !avatarFile) return onDone();

    updateProfile(
      { name: nameChanged ? name : undefined, avatarFile },
      { onSuccess: onDone },
    );
  };

  return (
    <>
      {sourceFile && (
        <AvatarCropStep
          file={sourceFile}
          onCancel={() => setSourceFile(null)}
          onConfirm={(file) => {
            setAvatarFile(file);
            setSourceFile(null);
          }}
        />
      )}

      <div className={sourceFile ? "hidden" : "contents"}>
        <DialogHeader>
          <DialogTitle>{t("chat.profile.title")}</DialogTitle>
          <DialogDescription>{t("chat.profile.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <AvatarPicker
            user={user}
            src={avatarPreview ?? user.avatar}
            disabled={isPending}
            onSelect={setSourceFile}
          />

          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <div className="grid gap-2">
                <Label
                  htmlFor="profile-name"
                  className={cn(fieldState.error && "text-destructive")}
                >
                  {t("chat.profile.nameLabel")}
                </Label>
                <Input
                  id="profile-name"
                  autoComplete="name"
                  aria-invalid={fieldState.invalid}
                  aria-describedby="profile-name-message"
                  className="h-11 rounded-xl"
                  {...field}
                />
                {fieldState.error && (
                  <p
                    id="profile-name-message"
                    className="text-sm text-destructive"
                  >
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="grid gap-2">
            <Label htmlFor="profile-email">
              {t("auth.register.emailLabel")}
            </Label>
            <Input
              id="profile-email"
              value={user.email}
              disabled
              readOnly
              className="h-11 rounded-xl"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                disabled={isPending}
              >
                {t("common.cancel")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending || (!isDirty && !avatarFile)}
              className="rounded-xl"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                t("common.save")
              )}
            </Button>
          </DialogFooter>
        </form>
      </div>
    </>
  );
}

export default ProfileEditor;
