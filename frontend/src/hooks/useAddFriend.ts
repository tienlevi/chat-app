import { ACCESS_TOKEN_KEY } from "@/constants";
import { QUERY_KEY } from "@/constants/query-key";
import { addFriend } from "@/services/friends";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useAddFriend() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["send-request"],
    mutationFn: async ({ friendId }: { friendId: string }) => {
      return await addFriend(friendId, accessToken || "");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FRIENDS] });
    },
  });
}

export default useAddFriend;
