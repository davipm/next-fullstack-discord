import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import MediaRoom from "@/components/media-room";
import currentProfile from "@/lib/current-profile";
import prisma from "@/lib/db";

interface Props {
  params: {
    serverId: string;
    channelId: string;
  };
}

export default async function Page({ params }: Props) {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const channel = await prisma.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await prisma.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) return redirect(`/servers/${params.serverId}`);

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={channel.serverId}
        name={channel.name}
        type="channel"
      />

      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            name={channel.name}
            member={member}
            chatId={channel.id}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
            paramKey="channelId"
            paramValue={channel.id}
            type="channel"
          />

          <ChatInput
            apiUrl="/api/messages"
            query={{ channelId: channel.id, serverId: channel.serverId }}
            name={channel.name}
            type="channel"
          />
        </>
      )}

      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} audio video />
      )}

      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} audio video />
      )}
    </div>
  );
}
