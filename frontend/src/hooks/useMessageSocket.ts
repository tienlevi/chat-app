import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/query-key";
import useSocketStore from "@/stores/useSocketStore";
import {
  readMessages,
  sendMessage as sendMessageService,
  unsendMessage as unsendMessageService,
  UnsendMessagePayload,
  type SendMessagePayload,
} from "@/services/messages";

function useMessageSocket() {
  const queryClient = useQueryClient();
  const { sendMessage, readMessage, unsendMessage } = useSocketStore();

  const { mutate, isPending: isSendingMessage } = useMutation({
    mutationKey: ["send-message"],
    mutationFn: async (data: SendMessagePayload) => sendMessageService(data),
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

  const { mutate: handleUnsendMessage } = useMutation({
    mutationKey: ["unsead-messages"],
    mutationFn: async (data: UnsendMessagePayload) => {
      return await unsendMessageService(data);
    },
    onSuccess: (_, data) => {
      unsendMessage(data.messageId);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.MESSAGE, data.messageId],
      });
    },
  });

  const sendMessageDirect = (
    receiverId: string,
    text: string,
    files: SendMessagePayload["files"] = [],
  ) => {
    mutate({ receiverId, text, files });
  };

  return {
    sendMessageDirect,
    handleReadMessages,
    handleUnsendMessage,
    isSendingMessage,
  };
}

export default useMessageSocket;
