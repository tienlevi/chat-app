import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/query-key";
import useSocketStore from "@/stores/useSocketStore";
import {
  readMessages,
  sendMessage as sendMessageService,
} from "@/services/messages";

function useMessageSocket() {
  const queryClient = useQueryClient();
  const { sendMessage, readMessage } = useSocketStore();

  const { mutate, isPending: isSendingMessage } = useMutation({
    mutationKey: ["send-message"],
    mutationFn: async (data: any) => sendMessageService(data),
    onSuccess: (response) => {
      const message = response.data;
      sendMessage(message);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.MESSAGE],
      });
    },
    onError: (error) => {
      console.error("Send message failed:", error);
    },
  });

  const { mutate: handleReadMessages } = useMutation({
    mutationKey: ["read-messages"],
    mutationFn: async (receiverId?: string) => {
      return await readMessages(receiverId || "");
    },
    onSuccess: (_, receiverId) => {
      readMessage(receiverId || "");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MESSAGE] });
    },
  });

  const sendMessageDirect = (receiverId: string, text: string) => {
    mutate({ receiverId, text });
  };

  return { sendMessageDirect, handleReadMessages, isSendingMessage };
}

export default useMessageSocket;
