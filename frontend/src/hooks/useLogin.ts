import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { login } from "@/services/auth";
import { QUERY_KEY } from "@/constants/query-key";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants";

function useLogin() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: { email: string; password: string }) => {
      return await login(data);
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER] });
        toast.success(t("auth.login.loginSuccess"));
        localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
        Cookies.set(REFRESH_TOKEN_KEY, data.refreshToken, {
          expires: 3,
          path: "/",
          secure: true,
          sameSite: "Strict",
        });
      }
    },
    onError: (error: any) => {
      const { code } = error.response.data;
      toast.error(t(`errors.${code}`));
    },
  });
}

export default useLogin;
