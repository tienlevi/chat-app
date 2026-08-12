import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterFormValues, registerSchema } from "@/utils/validations";
import { Link } from "react-router-dom";

export function RegisterForm({ className }: { className?: string }) {
  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: RegisterFormValues) {
    console.log(values);
  }

  return (
    <div className={cn("flex flex-col gap-8", className)}>
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
        <Button
          type="submit"
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
