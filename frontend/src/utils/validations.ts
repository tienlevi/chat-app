import i18n from "@/utils/i18n";
import { z } from "zod";

export const loginSchema = () =>
  z.object({
    email: z
      .email(i18n.t("auth.validation.emailInvalid"))
      .min(1, i18n.t("auth.validation.emailRequired")),
    password: z.string().min(6, i18n.t("auth.validation.passwordMin")),
  });

export type LoginFormValues = z.infer<ReturnType<typeof loginSchema>>;

export const registerSchema = () =>
  z
    .object({
      name: z.string().min(2, i18n.t("auth.validation.nameMin")),
      email: z
        .email(i18n.t("auth.validation.emailInvalid"))
        .min(1, i18n.t("auth.validation.emailRequired")),
      password: z.string().min(6, i18n.t("auth.validation.passwordMin")),
      confirmPassword: z
        .string()
        .min(1, i18n.t("auth.validation.confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: i18n.t("auth.validation.passwordMismatch"),
      path: ["confirmPassword"],
    });

export type RegisterFormValues = z.infer<ReturnType<typeof registerSchema>>;

export const nicknameSchema = () =>
  z.object({
    nickname: z.string().trim().max(50, i18n.t("chat.nickname.maxLength")),
  });

export type NicknameFormValues = z.infer<ReturnType<typeof nicknameSchema>>;
