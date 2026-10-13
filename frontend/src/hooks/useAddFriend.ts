import { QUERY_KEY } from "@/constants/query-key";
import { addFriend } from "@/services/friends";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useAddFriend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["send-request"],
    mutationFn: async ({ friendId }: { friendId: string }) => {
      return await addFriend(friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FRIENDS] });
    },
  });
}

export default useAddFriend;
