"use client";

import "@livekit/components-styles";

import { useUser } from "@clerk/nextjs";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface Props {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export function MediaRoom({ chatId, video, audio }: Props) {
  const { user } = useUser();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["videoCall"],
    queryFn: async () => {
      const name = `${user?.firstName} ${user?.lastName}`;

      const { data } = await axios.get<{ token: string }>(`/api/livekit?room=${chatId}&username=${name}`);

      return data.token;
    },
    enabled: !!user?.firstName || !!user?.lastName,
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Error!</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={data}
      video={video}
      audio={audio}
      connect
    >
      <VideoConference />
    </LiveKitRoom>
  );
}
