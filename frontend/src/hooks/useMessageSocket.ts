import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/query-key";
import useSocketStore from "@/stores/useSocketStore";
import { sendMessage as sendMessageService } from "@/services/messages";

function useMessageSocket() {
  const queryClient = useQueryClient();
  const { socket, sendMessage } = useSocketStore();

  const { mutate, isPending } = useMutation({
    mutationKey: ["send-message"],
    mutationFn: async (data: any) => sendMessageService(data),
    onSuccess: (response) => {
      const message = response.data;
      socket?.emit("send-message", message);
      sendMessage(message);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MESSAGE] });
    },
    onError: (error) => {
      console.error("Send message failed:", error);
    },
  });

  const sendMessageDirect = (receiverId: string, text: string) => {
    mutate({ receiverId, text });
  };

  return { sendMessageDirect, isPending };
}

export default useMessageSocket;
