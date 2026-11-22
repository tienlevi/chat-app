import { QUERY_KEY } from "@/constants/query-key";
import { blockFriend, unblockFriend } from "@/services/friends";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useBlockFriend(type: "block" | "unblock") {
  const queryClient = useQueryClient();

  return type === "block"
    ? useMutation({
        mutationKey: ["block-friend"],
        mutationFn: async (userId: string) => blockFriend(userId),
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FRIENDS] }),
      })
    : useMutation({
        mutationKey: ["unblock-friend"],
        mutationFn: async (userId: string) => unblockFriend(userId),
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FRIENDS] }),
      });
}

export default useBlockFriend;
