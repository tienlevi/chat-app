import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterFormValues, registerSchema } from "@/utils/validations";
import { Link } from "react-router-dom";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import { uploadFile } from "@/services/cloudinary";
import useRegister from "@/hooks/useRegister";
import { toast } from "sonner";

export function RegisterForm() {
  const imageRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  console.log("🚀 ~ RegisterForm ~ avatarPreview:", avatarPreview);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
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

  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });
  console.log(imageRef.current?.files?.[0]);

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
        toast.error("Failed to upload avatar");
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
                  Name
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Your name"
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
                  Email
                </Label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="you@example.com"
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
                Password
              </Label>
              <Input
                type="password"
                className="h-12 rounded-xl text-base font-medium"
                {...field}
              />
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
                Confirm password
              </Label>
              <Input
                type="password"
                className="h-12 rounded-xl text-base font-medium"
                {...field}
              />
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
          <FieldLabel htmlFor="picture">Avatar</FieldLabel>
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
          <FieldDescription>Select a picture to upload.</FieldDescription>
        </Field>
        <Button
          type="submit"
          disabled={isUploadingAvatar || isPending}
          className="mt-2 h-12 rounded-xl text-base font-semibold"
        >
          Register
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/"
          className="font-semibold text-foreground hover:text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
