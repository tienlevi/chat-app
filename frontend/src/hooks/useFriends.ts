import { QUERY_KEY } from "@/constants/query-key";
import { IFriend } from "@/interfaces/friend";
import IUser from "@/interfaces/user";
import { getFriendsByUserId, searchFriends } from "@/services/friends";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

function useFriends(debounce?: string) {
  const { data: friends, isLoading: isLoadingFriend } = useQuery<IFriend[]>({
    queryKey: [QUERY_KEY.FRIENDS],
    queryFn: async () => await getFriendsByUserId(),
  });
  const friend = friends?.[0];

  const { data: users, isLoading: isLoadingUsers } = useQuery<IUser[]>({
    queryKey: [QUERY_KEY.FRIENDS, "search", debounce || ""],
    queryFn: async () => await searchFriends(debounce || ""),
    placeholderData: keepPreviousData,
  });

  return {
    friend,
    isLoadingFriend,
    users: users || [],
    isLoadingUsers,
  };
}

export default useFriends;
