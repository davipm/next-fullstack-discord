import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

import { useSocket } from "@/providers/socket-provider";

interface Props {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export default function useChatQuery({
  queryKey,
  paramKey,
  paramValue,
  apiUrl,
}: Props) {
  const { isConnected } = useSocket();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: async ({ pageParam }) => {
        const url = qs.stringifyUrl(
          {
            url: apiUrl,
            query: {
              cursor: pageParam,
              [paramKey]: paramValue,
            },
          },
          { skipNull: true },
        );

        const res = await fetch(url);
        return res.json();
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
      refetchInterval: isConnected ? false : 1000,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
}
