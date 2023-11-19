import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import qs from "query-string";

import { useSocket } from "@/providers/socket-provider";

interface Props {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export default function useChatQuery({ queryKey, paramKey, ...rest }: Props) {
  const { isConnected } = useSocket();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: async ({ pageParam }) => {
        const url = qs.stringifyUrl(
          {
            url: rest.apiUrl,
            query: {
              cursor: pageParam,
              [paramKey]: rest.paramValue,
            },
          },
          { skipNull: true },
        );

        const { data } = await axios.get(url);
        return data;
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
