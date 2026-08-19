import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { login } from "@/services/auth";
import { QUERY_KEY } from "@/constants/query-key";
import { toast } from "sonner";

function useLogin() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: { email: string; password: string }) => {
      return await login(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER] });
      toast.success(t("auth.login.loginSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });
}

export default useLogin;
