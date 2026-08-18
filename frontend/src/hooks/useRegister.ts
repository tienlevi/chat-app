import { useMutation, useQueryClient } from "@tanstack/react-query";
import IUser from "@/interfaces/user";
import { register } from "@/services/auth";
import { QUERY_KEY } from "@/constants/query-key";
import { toast } from "sonner";

function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: IUser) => {
      return await register(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER] });
      toast.success("Register successfully");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });
}

export default useRegister;
