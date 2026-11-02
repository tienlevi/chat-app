import { QUERY_KEY } from "@/constants/query-key";
import { setNickname } from "@/services/friends";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

function useSetNickname() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["set-nickname"],
    mutationFn: async ({
      friendId,
      nickname,
    }: {
      friendId: string;
      nickname: string;
    }) => {
      return await setNickname(friendId, nickname);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FRIENDS] });
      toast.success(t("chat.nickname.success"));
    },
    onError: () => {
      toast.error(t("chat.nickname.error"));
    },
  });
}

export default useSetNickname;
