"use client";

import { Member, Message, Profile } from "@prisma/client";
import { format } from "date-fns";
import { Loader2, ServerCrash } from "lucide-react";
import { ElementRef, Fragment, useRef } from "react";

import ChatItem from "@/components/chat/chat-item";
import ChatWelcome from "@/components/chat/chat-welcome";
import useChatQuery from "@/hooks/use-chat-query";
import useChatScroll from "@/hooks/use-chat-scroll";
import useChatSocket from "@/hooks/use-chat-socket";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

interface Props {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

export default function ChatMessages({ name, member, chatId, ...rest }: Props) {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:message`;
  const updateKey = `chat:${chatId}:message:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl: rest.apiUrl,
      paramKey: rest.paramKey,
      paramValue: rest.paramValue,
    });

  const isLoading = status === "pending";
  const isError = status === "error";

  useChatSocket({ queryKey, addKey, updateKey });

  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && hasNextPage,
    count: data?.pages[0].items.length ?? 0,
  });

  if (isLoading || isError) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        {isLoading && <Loader2 className="icon-loader" />}
        {isError && <ServerCrash className="icon-loader" />}

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {isLoading && "Loading messages..."}
          {isError && "Something went wrong!"}
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome name={name} type={rest.type} />}

      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              type="button"
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                {...message}
                key={message.id}
                id={message.id}
                currentMember={member}
                socketUrl={rest.socketUrl}
                socketQuery={rest.socketQuery}
                isUpdated={message.updatedAt !== message.createdAt}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
              />
            ))}
          </Fragment>
        ))}
      </div>

      <div ref={bottomRef} />
    </div>
  );
}
