import { QUERY_KEY } from "@/constants/query-key";
import { IMessage } from "@/interfaces/message";
import {
  getLastestMessage,
  getMessageByReceiverId,
  getMessageByUser,
} from "@/services/messages";
import { formatISODateToTimestamp } from "@/utils/format";
import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

const PAGE_SIZE = 10;

function useMessages(receiverId?: string) {
  const {
    data,
    isLoading: loadingReceiverMessages,
    fetchNextPage,
    hasNextPage: hasOlderMessages,
    isFetchingNextPage: isFetchingOlderMessages,
  } = useInfiniteQuery<
    IMessage[],
    Error,
    InfiniteData<IMessage[], number>,
    (string | undefined)[],
    number
  >({
    queryKey: [QUERY_KEY.MESSAGE, receiverId],
    queryFn: ({ pageParam }) =>
      getMessageByReceiverId(receiverId || "", pageParam),
    initialPageParam: PAGE_SIZE,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length < lastPageParam ? undefined : lastPageParam + PAGE_SIZE,
    maxPages: 1,
    enabled: !!receiverId,
  });

  const receiverMessages = useMemo(() => {
    const latestPage = data?.pages[data.pages.length - 1] ?? [];
    return latestPage.sort(
      (a, b) =>
        formatISODateToTimestamp(a.createdAt) -
        formatISODateToTimestamp(b.createdAt),
    );
  }, [data]);

  const fetchOlderMessages = useCallback(() => {
    if (hasOlderMessages && !isFetchingOlderMessages) fetchNextPage();
  }, [hasOlderMessages, isFetchingOlderMessages, fetchNextPage]);

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

  return {
    receiverMessages,
    senderMessages,
    latestMessages,
    loadingReceiverMessages,
    loadingSenderMessages,
    loadingLatestMessages,
    fetchOlderMessages,
    hasOlderMessages,
    isFetchingOlderMessages,
  };
}

export default useMessages;
