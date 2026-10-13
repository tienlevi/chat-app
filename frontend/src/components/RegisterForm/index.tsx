import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterFormValues, registerSchema } from "@/utils/validations";
import { Link } from "react-router-dom";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { useEffect, useMemo, useRef, useState } from "react";
import Avatar from "./Avatar";
import { uploadFile } from "@/services/cloudinary";
import useRegister from "@/hooks/useRegister";
import { toast } from "sonner";

function RegisterForm() {
  const { t, i18n } = useTranslation();
  const imageRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: handleRegister, isPending } = useRegister();

  const handleCropConfirm = (_: File, previewUrl: string) => {
    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return previewUrl;
    });
  };

  const handleCropCancel = () => {
    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (imageRef.current) imageRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  };

  const schema = useMemo(() => registerSchema(), [i18n.language]);
  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    const file = imageRef.current?.files?.[0];

    if (file) {
      try {
        setIsUploadingAvatar(true);
        const image = await uploadFile(file);
        handleRegister({
          ...values,
          avatar: image?.secure_url,
        });
      } catch {
        toast.error(t("auth.register.uploadAvatarFailed"));
        return;
      } finally {
        setIsUploadingAvatar(false);
      }
    } else {
      handleRegister(values);
    }
  };

  return (
    <div className={cn("flex flex-col gap-8")}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => {
            const isValid = fieldState.isDirty && !fieldState.invalid;
            return (
              <div className="grid gap-2">
                <Label
                  htmlFor="name"
                  className={cn(fieldState.error && "text-destructive")}
                >
                  {t("auth.register.nameLabel")}
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={t("auth.register.namePlaceholder")}
                    className={cn(
                      "h-12 rounded-xl pr-10 text-base font-medium",
                      isValid &&
                        "border-success bg-success/10 text-success focus-visible:border-success focus-visible:ring-success/30",
                    )}
                    {...field}
                  />
                  {isValid && (
                    <Check
                      className="text-success pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2"
                      strokeWidth={2.5}
                    />
                  )}
                </div>
                {fieldState.error && (
                  <p id="name-message" className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            );
          }}
        />
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => {
            const isValid = fieldState.isDirty && !fieldState.invalid;
            return (
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className={cn(fieldState.error && "text-destructive")}
                >
                  {t("auth.register.emailLabel")}
                </Label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder={t("auth.register.emailPlaceholder")}
                    className={cn(
                      "h-12 rounded-xl pr-10 text-base font-medium",
                      isValid &&
                        "border-success bg-success/10 text-success focus-visible:border-success focus-visible:ring-success/30",
                    )}
                    {...field}
                  />
                  {isValid && (
                    <Check
                      className="text-success pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2"
                      strokeWidth={2.5}
                    />
                  )}
                </div>
                {fieldState.error && (
                  <p id="email-message" className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            );
          }}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <div className="grid gap-2">
              <Label
                htmlFor="password"
                className={cn(fieldState.error && "text-destructive")}
              >
                {t("auth.register.passwordLabel")}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="h-12 rounded-xl pr-10 text-base font-medium"
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
              {fieldState.error && (
                <p id="password-message" className="text-sm text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <div className="grid gap-2">
              <Label
                htmlFor="confirmPassword"
                className={cn(fieldState.error && "text-destructive")}
              >
                {t("auth.register.confirmPasswordLabel")}
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  className="h-12 rounded-xl pr-10 text-base font-medium"
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
              {fieldState.error && (
                <p
                  id="confirmPassword-message"
                  className="text-sm text-destructive"
                >
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
        <Field>
          <FieldLabel htmlFor="picture">
            {t("auth.register.avatarLabel")}
          </FieldLabel>
          <div className="flex flex-col items-center gap-4">
            <Avatar
              src={avatarPreview}
              className="w-full"
              onCropConfirm={handleCropConfirm}
              onCropCancel={handleCropCancel}
            />
            <Input
              id="picture"
              ref={imageRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
          <FieldDescription>
            {t("auth.register.avatarDescription")}
          </FieldDescription>
        </Field>
        <Button
          type="submit"
          disabled={isUploadingAvatar || isPending}
          className="mt-2 h-12 rounded-xl text-base font-semibold"
        >
          {t("auth.register.submit")}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t("auth.register.haveAccount")}{" "}
        <Link
          to="/"
          className="font-semibold text-foreground hover:text-primary hover:underline"
        >
          {t("auth.register.logIn")}
        </Link>
      </p>
    </div>
  );
}
export default RegisterForm;
