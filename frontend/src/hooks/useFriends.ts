import { ACCESS_TOKEN_KEY } from "@/constants";
import { QUERY_KEY } from "@/constants/query-key";
import { IFriend } from "@/interfaces/friend";
import { getFriends } from "@/services/friends";
import { useQuery } from "@tanstack/react-query";

function useFriends() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  const { data, ...rest } = useQuery<IFriend[]>({
    queryKey: [QUERY_KEY.FRIENDS],
    queryFn: async () => await getFriends(accessToken || ""),
    initialData: [],
  });
  const friend = data[0];

  return { friend, ...rest };
}

export default useFriends;
