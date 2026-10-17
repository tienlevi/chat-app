import { QUERY_KEY } from "@/constants/query-key";
import { blockFriend } from "@/services/friends";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useBlockFriend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["block-friend"],
    mutationFn: async (friendId: string) => blockFriend(friendId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FRIENDS] }),
  });
}

export default useBlockFriend;
