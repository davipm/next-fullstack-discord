import { RefObject, useEffect, useState } from "react";

interface Props {
  chatRef: RefObject<HTMLDivElement>;
  bottomRef: RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
}

export default function useChatScroll({ chatRef, count, ...rest }: Props) {
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const topDiv = chatRef?.current;

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;
      if (scrollTop === 0 && rest.shouldLoadMore) rest.loadMore();
    };

    topDiv?.addEventListener("scroll", handleScroll);

    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [chatRef, rest, rest.loadMore, rest.shouldLoadMore]);

  useEffect(() => {
    const bottomDiv = rest.bottomRef?.current;
    const topDiv = chatRef?.current;

    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topDiv) return false;

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      // Only auto scroll if the distance from the bottom is less than 100 pixels
      // and the user hasn't scrolled up manually.
      return distanceFromBottom <= 100 && topDiv.scrollTop === 0;
    };

    if (shouldAutoScroll()) {
      const scrollTimeout = setTimeout(() => {
        rest.bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);

      return () => {
        clearTimeout(scrollTimeout);
      };
    }
  }, [rest.bottomRef, chatRef, hasInitialized, count]);
}
