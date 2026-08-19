import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginFormValues, loginSchema } from "@/utils/validations";
import { Link } from "react-router-dom";
import useLogin from "@/hooks/useLogin";

function LoginForm() {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => loginSchema(), [i18n.language]);
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
  });
  const { mutate: handleLogin } = useLogin();

  function onSubmit(values: LoginFormValues) {
    handleLogin(values);
  }

  return (
    <div className={cn("flex flex-col gap-8")}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
                  {t("auth.login.emailLabel")}
                </Label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder={t("auth.login.emailPlaceholder")}
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
              <div className="flex items-center">
                <Label
                  htmlFor="password"
                  className={cn(fieldState.error && "text-destructive")}
                >
                  {t("auth.login.passwordLabel")}
                </Label>
                <a
                  href="#"
                  className="ml-auto text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  {t("auth.login.forgotPassword")}
                </a>
              </div>
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
        <Button
          type="submit"
          className="mt-2 h-12 rounded-xl text-base font-semibold"
        >
          {t("auth.login.submit")}
          <ArrowRight className="size-4" strokeWidth={2.5} />
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t("auth.login.noAccount")}{" "}
        <Link
          to="/register"
          className="font-semibold text-foreground hover:text-primary hover:underline"
        >
          {t("auth.login.signUp")}
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;
