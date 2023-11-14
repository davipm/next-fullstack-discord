import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import MediaRoom from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import currentProfile from "@/lib/current-profile";
import prisma from "@/lib/db";

interface Props {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

export default async function Page({ params, searchParams }: Props) {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const currentMember = await prisma.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: { profile: true },
  });

  if (!currentMember) return redirect("/");

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId,
  );

  if (!conversation) return redirect(`/servers/${params.serverId}`);

  const { memberTwo, memberOne } = conversation;
  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        serverId={params.serverId}
        name={otherMember.profile.name}
        type="conversation"
      />

      {searchParams.video ? (
        <MediaRoom chatId={conversation.id} video audio />
      ) : (
        <>
          <ChatMessages
            name={otherMember.profile.name}
            member={currentMember}
            chatId={conversation.id}
            apiUrl="/api/direct-messages"
            socketUrl="/api/socket/direct-messages"
            socketQuery={{ conversation: conversation.id }}
            paramKey="conversationId"
            paramValue={conversation.id}
            type="conversation"
          />

          <ChatInput
            apiUrl="/api/socket/direct-messages"
            query={{ conversation: conversation.id }}
            name={otherMember.profile.name}
            type="conversation"
          />
        </>
      )}
    </div>
  );
}
