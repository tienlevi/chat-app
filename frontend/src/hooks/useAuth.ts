import { ACCESS_TOKEN_KEY } from "@/constants";
import { QUERY_KEY } from "@/constants/query-key";
import { getUser } from "@/services/users";
import { useQuery } from "@tanstack/react-query";

function useAuth() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  return useQuery({
    queryKey: [QUERY_KEY.USER, accessToken],
    queryFn: async () => {
      return await getUser(accessToken || "");
    },
    enabled: !!accessToken,
  });
}

export default useAuth;
