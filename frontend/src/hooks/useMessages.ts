import { QUERY_KEY } from "@/constants/query-key";
import { IMessage } from "@/interfaces/message";
import {
  getLastestMessage,
  getMessageByReceiverId,
  getMessageByUser,
} from "@/services/messages";
import { formatISODateToTimestamp } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

function useMessages(receiverId?: string) {
  const { data, isLoading: loadingReceiverMessages } = useQuery<IMessage[]>({
    queryKey: [QUERY_KEY.MESSAGE, receiverId],
    queryFn: async () => getMessageByReceiverId(receiverId || ""),
    initialData: [],
  });

  const { data: senderMessages, isLoading: loadingSenderMessages } = useQuery<
    IMessage[]
  >({
    queryKey: [QUERY_KEY.MESSAGE],
    queryFn: async () => getMessageByUser(),
    initialData: [],
  });

  const { data: latestMessages, isLoading: loadingLatestMessages } = useQuery<
    IMessage[]
  >({
    queryKey: [QUERY_KEY.MESSAGE, "latest"],
    queryFn: async () => getLastestMessage(),
    initialData: [],
  });

  const receiverMessages = useMemo(
    () =>
      data.sort(
        (a, b) =>
          formatISODateToTimestamp(a.createdAt) -
          formatISODateToTimestamp(b.createdAt),
      ),
    [data],
  );

  return {
    receiverMessages,
    senderMessages,
    latestMessages,
    loadingReceiverMessages,
    loadingSenderMessages,
    loadingLatestMessages,
  };
}

export default useMessages;
