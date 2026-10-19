import { QUERY_KEY } from "@/constants/query-key";
import { IMessage } from "@/interfaces/message";
import { getMessageByReceiverId } from "@/services/messages";
import { formatISODateToTimestamp } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";

function useMessages(receiverId: string) {
  const { data, ...rest } = useQuery<IMessage[]>({
    queryKey: [QUERY_KEY.MESSAGE, receiverId],
    queryFn: async () => getMessageByReceiverId(receiverId),
    initialData: [],
    enabled: !!receiverId,
  });

  const messages = data.sort(
    (a, b) =>
      formatISODateToTimestamp(a.createdAt) -
      formatISODateToTimestamp(b.createdAt),
  );

  return { messages, ...rest };
}

export default useMessages;
