import { QUERY_KEY } from "@/constants/query-key";
import { IMessage } from "@/interfaces/message";
import { getMessageByReceiverId, getMessageByUser } from "@/services/messages";
import { formatISODateToTimestamp } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";

function useMessages(receiverId: string) {
  const { data, isLoading: loadingReceiverMessages } = useQuery<IMessage[]>({
    queryKey: [QUERY_KEY.MESSAGE, receiverId],
    queryFn: async () => getMessageByReceiverId(receiverId),
    initialData: [],
    enabled: !!receiverId,
  });

  const { data: senderMessages, isLoading: loadingSenderMessages } = useQuery<
    IMessage[]
  >({
    queryKey: [QUERY_KEY.MESSAGE],
    queryFn: async () => getMessageByUser(),
    initialData: [],
  });

  const receiverMessages = data.sort(
    (a, b) =>
      formatISODateToTimestamp(a.createdAt) -
      formatISODateToTimestamp(b.createdAt),
  );

  return {
    receiverMessages,
    senderMessages,
    loadingReceiverMessages,
    loadingSenderMessages,
  };
}

export default useMessages;
