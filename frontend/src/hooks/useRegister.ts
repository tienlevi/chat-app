import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import IUser from "@/interfaces/user";
import { register } from "@/services/auth";
import { QUERY_KEY } from "@/constants/query-key";
import { toast } from "sonner";

function useRegister() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: IUser) => {
      return await register(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER] });
      toast.success(t("auth.register.registerSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });
}

export default useRegister;
