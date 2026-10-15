import { QUERY_KEY } from "@/constants/query-key";
import { acceptFriend, delineFriend } from "@/services/friends";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useAcceptDelineFriend(type: "accept" | "deline") {
  const queryClient = useQueryClient();

  return type === "accept"
    ? useMutation({
        mutationKey: ["accept"],
        mutationFn: async (friendId: string) => {
          return await acceptFriend(friendId);
        },
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FRIENDS] }),
      })
    : useMutation({
        mutationKey: ["deline"],
        mutationFn: async (friendId: string) => {
          return await delineFriend(friendId);
        },
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FRIENDS] }),
      });
}

export default useAcceptDelineFriend;
