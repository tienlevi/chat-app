import { QUERY_KEY } from "@/constants/query-key";
import { getUsers } from "@/services/users";
import { useQuery } from "@tanstack/react-query";
import IUser from "@/interfaces/user";

function useUsers(name?: string) {
  return useQuery<IUser[]>({
    queryKey: [QUERY_KEY.USER, name],
    queryFn: async () => await getUsers(name || ""),
    enabled: !!name,
    initialData: [],
  });
}

export default useUsers;
